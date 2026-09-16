import { Factory, FactoryCascade } from "@/entities/factory";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";

import { FactoryCascadeIndex, GraphChip } from "./types";

function toMap<T>(source: Record<string, T> | undefined): Map<string, T> {
  return new Map(Object.entries(source ?? {}));
}

/**
 * Display names by id. Falls back to `key` because several cascade entities
 * come back keyed but unnamed, and a key still reads better than an id.
 */
function toNameMap(
  source:
    | Record<string, { id?: string; name?: string; key?: string }>
    | undefined
): Map<string, string> {
  const entries = Object.values(source ?? {}).reduce<[string, string][]>(
    (acc, item) => {
      const label = isPopulatedString(item.name)
        ? item.name
        : isPopulatedString(item.key)
          ? item.key
          : undefined;

      if (isPopulatedString(item.id) && label) acc.push([item.id, label]);

      return acc;
    },
    []
  );

  return new Map(entries);
}

/** Turns one cascade response into id-keyed lookups the builders read from. */
export function indexCascade({
  factory,
  relatedObjects,
}: FactoryCascade): FactoryCascadeIndex {
  const factories = toMap(relatedObjects.factoryMap);

  // The root is not always echoed back into `factoryMap`, but every builder
  // resolves factories through the map — so seed it.
  if (isPopulatedString(factory.id) && !factories.has(factory.id)) {
    factories.set(factory.id, factory);
  }

  const pipelines = toMap(relatedObjects.factoryPipelineMap);
  const branches = toMap(relatedObjects.factoryBranchMap);

  return {
    root: factory,
    factories,
    pipelines,
    steps: toMap(relatedObjects.factoryPipelineStepMap),
    branches,
    multipliers: toMap(relatedObjects.factoryMultiplierMap),
    multiplierFilters: toMap(relatedObjects.factoryMultiplierFilterMap),
    erasers: toMap(relatedObjects.factoryEraserMap),
    conditionSets: toMap(relatedObjects.factoryConditionSetMap),
    conditions: toMap(relatedObjects.factoryConditionMap),
    triggers: toMap(relatedObjects.factoryTriggerMap),
    twinClassNameById: toNameMap(relatedObjects.twinClassMap),
    statusNameById: toNameMap(relatedObjects.statusMap),
    callersByFactoryId: indexCallers(pipelines, branches),
  };
}

/**
 * Reverses the hand-over links: for each factory, the pipelines and branches
 * that lead into it. The cascade only walks downwards, so the factory the tab is
 * opened on has no callers of its own here — its "Called From" block is simply
 * left out rather than shown empty.
 */
function indexCallers(
  pipelines: FactoryCascadeIndex["pipelines"],
  branches: FactoryCascadeIndex["branches"]
): Map<string, GraphChip[]> {
  const callers = new Map<string, GraphChip[]>();

  function add(factoryId: string | undefined, chip: GraphChip) {
    if (!isPopulatedString(factoryId)) return;
    callers.set(factoryId, [...(callers.get(factoryId) ?? []), chip]);
  }

  pipelines.forEach((pipeline, id) => {
    const chip: GraphChip = {
      id: `caller:pipeline:${id}`,
      kind: "pipeline",
      label: isPopulatedString(pipeline.description)
        ? pipeline.description
        : "Pipeline",
      href: `/${PlatformArea.core}/pipelines/${id}`,
    };

    add(pipeline.nextFactoryId, chip);
    // A pipeline can also hand a twin over after commit — a second way into a
    // factory, and one the tree itself does not draw.
    add(pipeline.afterCommitFactoryId, chip);
  });

  branches.forEach((branch, id) => {
    add(branch.nextFactoryId, {
      id: `caller:branch:${id}`,
      kind: "branch",
      label: isPopulatedString(branch.description)
        ? branch.description
        : "Branch",
      href: `/${PlatformArea.core}/branches/${id}`,
    });
  });

  return callers;
}

/**
 * Folds separately-fetched callers into the ones the cascade already implies,
 * keeping each caller once — a pipeline reachable both ways would otherwise be
 * listed twice on the same card.
 */
export function mergeCallers(
  base: Map<string, GraphChip[]>,
  extra: Map<string, GraphChip[]>
): Map<string, GraphChip[]> {
  const merged = new Map(base);

  extra.forEach((chips, factoryId) => {
    const seen = new Set((merged.get(factoryId) ?? []).map((chip) => chip.id));

    merged.set(factoryId, [
      ...(merged.get(factoryId) ?? []),
      ...chips.filter((chip) => !seen.has(chip.id)),
    ]);
  });

  return merged;
}

/** Resolves a list of ids against a map, dropping anything not delivered. */
export function resolveAll<T>(
  ids: string[] | undefined,
  source: Map<string, T>
): T[] {
  return (ids ?? []).reduce<T[]>((acc, id) => {
    const item = source.get(id);
    if (item) acc.push(item);
    return acc;
  }, []);
}

export function getFactoryLabel(factory: Factory | undefined): string {
  if (!factory) return "Factory";

  return isPopulatedString(factory.name)
    ? factory.name
    : isPopulatedString(factory.key)
      ? factory.key
      : "Factory";
}

/**
 * Entities of the cascade carry `inputTwinClassId` while the name lives in
 * `twinClassMap`. When the class was not delivered the label is dropped rather
 * than falling back to the raw id — an unreadable uuid under every node is
 * worse than no second line at all.
 */
export function getTwinClassLabel(
  index: FactoryCascadeIndex,
  twinClassId: string | undefined
): string | undefined {
  if (!isPopulatedString(twinClassId)) return undefined;

  return index.twinClassNameById.get(twinClassId);
}
