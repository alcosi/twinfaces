import { Factory, FactoryCascade } from "@/entities/factory";
import { hydrateFactoryBranchFromMap } from "@/entities/factory-branch";
import { hydrateFactoryConditionSetFromMap } from "@/entities/factory-condition-set";
import { hydrateFactoryEraserFromMap } from "@/entities/factory-eraser";
import { hydrateFactoryMultiplierFromMap } from "@/entities/factory-multiplier";
import { hydrateFactoryMultiplierFilterFromMap } from "@/entities/factory-multiplier-filter";
import { hydrateFactoryPipelineFromMap } from "@/entities/factory-pipeline";
import { hydratePipelineStepFromMap } from "@/entities/factory-pipeline-step";
import { hydrateFactoryTriggerFromMap } from "@/entities/factory-trigger";
import { hydrateTwinClassFromMap } from "@/entities/twin-class";
import { hydrateTwinStatusFromMap } from "@/entities/twin-status";
import { isFalsy, isPopulatedString } from "@/shared/libs";

import { FactoryCascadeIndex, GraphChip } from "./types";

function toMap<T>(source: Record<string, T> | undefined): Map<string, T> {
  return new Map(Object.entries(source ?? {}));
}

/**
 * Same, but each entity is run through its own hydrator on the way in, so the
 * nested objects the resource links read — a branch's next factory, a step's
 * featurer, a filter's multiplier — are filled from the cascade's related maps
 * rather than left as bare ids.
 */
function toHydratedMap<D, H>(
  source: Record<string, D> | undefined,
  hydrate: (dto: D) => H
): Map<string, H> {
  return new Map(
    Object.entries(source ?? {}).map(([id, dto]) => [id, hydrate(dto)])
  );
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

  const pipelines = toHydratedMap(relatedObjects.factoryPipelineMap, (dto) =>
    hydrateFactoryPipelineFromMap(dto, relatedObjects)
  );
  const branches = toHydratedMap(relatedObjects.factoryBranchMap, (dto) =>
    hydrateFactoryBranchFromMap(dto, relatedObjects)
  );

  return {
    root: factory,
    factories,
    pipelines,
    steps: toHydratedMap(relatedObjects.factoryPipelineStepMap, (dto) =>
      hydratePipelineStepFromMap(dto, relatedObjects)
    ),
    branches,
    multipliers: toHydratedMap(relatedObjects.factoryMultiplierMap, (dto) =>
      hydrateFactoryMultiplierFromMap(dto, relatedObjects)
    ),
    multiplierFilters: toHydratedMap(
      relatedObjects.factoryMultiplierFilterMap,
      (dto) => hydrateFactoryMultiplierFilterFromMap(dto, relatedObjects)
    ),
    erasers: toHydratedMap(relatedObjects.factoryEraserMap, (dto) =>
      hydrateFactoryEraserFromMap(dto, relatedObjects)
    ),
    conditionSets: toHydratedMap(relatedObjects.factoryConditionSetMap, (dto) =>
      hydrateFactoryConditionSetFromMap(dto, relatedObjects)
    ),
    conditions: toMap(relatedObjects.factoryConditionMap),
    triggers: toHydratedMap(relatedObjects.factoryTriggerMap, (dto) =>
      hydrateFactoryTriggerFromMap(dto, relatedObjects)
    ),
    twinClasses: toHydratedMap(relatedObjects.twinClassMap, (dto) =>
      hydrateTwinClassFromMap(dto, relatedObjects)
    ),
    statuses: toHydratedMap(relatedObjects.statusMap, (dto) =>
      hydrateTwinStatusFromMap(dto, relatedObjects)
    ),
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
      entity: pipeline,
      inactive: isFalsy(pipeline.active),
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
      entity: branch,
      inactive: isFalsy(branch.active),
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
 * Entities of the cascade carry `inputTwinClassId` while the class itself lives
 * in `twinClassMap`. When it was not delivered the label is dropped rather than
 * falling back to the raw id — an unreadable uuid under every node is worse than
 * no second line at all.
 */
export function getTwinClassLabel(
  index: FactoryCascadeIndex,
  twinClassId: string | undefined
): string | undefined {
  if (!isPopulatedString(twinClassId)) return undefined;

  const twinClass = index.twinClasses.get(twinClassId);

  return isPopulatedString(twinClass?.name) ? twinClass.name : undefined;
}
