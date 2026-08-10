import { Factory, FactoryCascade } from "@/entities/factory";
import { isPopulatedString } from "@/shared/libs";

import { FactoryCascadeIndex } from "./types";

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

  return {
    root: factory,
    factories,
    pipelines: toMap(relatedObjects.factoryPipelineMap),
    steps: toMap(relatedObjects.factoryPipelineStepMap),
    branches: toMap(relatedObjects.factoryBranchMap),
    multipliers: toMap(relatedObjects.factoryMultiplierMap),
    multiplierFilters: toMap(relatedObjects.factoryMultiplierFilterMap),
    erasers: toMap(relatedObjects.factoryEraserMap),
    conditionSets: toMap(relatedObjects.factoryConditionSetMap),
    conditions: toMap(relatedObjects.factoryConditionMap),
    twinClassNameById: toNameMap(relatedObjects.twinClassMap),
    statusNameById: toNameMap(relatedObjects.statusMap),
  };
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
 * than falling back to the raw id — an unreadable uuid under every diamond is
 * worse than no second line at all.
 */
export function getTwinClassLabel(
  index: FactoryCascadeIndex,
  twinClassId: string | undefined
): string | undefined {
  if (!isPopulatedString(twinClassId)) return undefined;

  return index.twinClassNameById.get(twinClassId);
}
