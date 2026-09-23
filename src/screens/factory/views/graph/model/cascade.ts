import {
  Factory,
  FactoryCascade,
  FactoryUsage,
  FactoryUsages,
} from "@/entities/factory";
import { hydrateFactoryBranchFromMap } from "@/entities/factory-branch";
import { hydrateFactoryConditionSetFromMap } from "@/entities/factory-condition-set";
import { hydrateFactoryEraserFromMap } from "@/entities/factory-eraser";
import { hydrateFactoryMultiplierFromMap } from "@/entities/factory-multiplier";
import { hydrateFactoryMultiplierFilterFromMap } from "@/entities/factory-multiplier-filter";
import { hydrateFactoryPipelineFromMap } from "@/entities/factory-pipeline";
import { hydratePipelineStepFromMap } from "@/entities/factory-pipeline-step";
import { hydrateFactoryTriggerFromMap } from "@/entities/factory-trigger";
import { hydrateTwinClassFromMap } from "@/entities/twin-class";
import { hydrateTwinFlowTransitionFromMap } from "@/entities/twin-flow-transition";
import { hydrateTwinStatusFromMap } from "@/entities/twin-status";
import { hydrateTwinFlowFactoryFromMap } from "@/entities/twinflow-factory";
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
  const transitions = toHydratedMap(relatedObjects.transitionsMap, (dto) =>
    hydrateTwinFlowTransitionFromMap(dto, relatedObjects)
  );
  const twinflowFactories = toHydratedMap(
    relatedObjects.twinflowFactoryMap,
    (dto) => hydrateTwinFlowFactoryFromMap(dto, relatedObjects)
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
    transitions,
    twinflowFactories,
    callersByFactoryId: buildCallers(factories.values(), {
      pipelines,
      branches,
      transitions,
      twinflowFactories,
    }),
  };
}

/**
 * The "Called From" block of every factory, read off its `usages`.
 *
 * A factory can be entered in ways the canvas has no line for — a pipeline of a
 * factory that is not in this cascade at all, a transition that runs it in-built,
 * a twinflow that launches it — and only the backend knows about those. Each
 * usage names the referencing entity by id and kind; the entity itself arrives
 * in the related maps, already hydrated here.
 */
export function buildCallers(
  factories: Iterable<Factory>,
  sources: Pick<
    FactoryCascadeIndex,
    "pipelines" | "branches" | "transitions" | "twinflowFactories"
  >
): Map<string, GraphChip[]> {
  const callers = new Map<string, GraphChip[]>();

  for (const factory of factories) {
    const factoryId = factory.id;
    if (!isPopulatedString(factoryId)) continue;

    const chips = (factory.usages ?? []).reduce<GraphChip[]>((acc, usage) => {
      const chip = usageChip(usage, sources);
      // Two usages of the same kind can name the same entity — a pipeline that
      // both hands over and hands over after commit, say. It is one way in.
      if (chip && !acc.some((existing) => existing.id === chip.id)) {
        acc.push(chip);
      }

      return acc;
    }, []);

    if (chips.length > 0) callers.set(factoryId, chips);
  }

  return callers;
}

/**
 * The same, from a usages search rather than from an indexed cascade: the
 * referencing entities come in that response's own related objects.
 */
export function buildCallersFromUsages({
  factories,
  relatedObjects,
}: FactoryUsages): Map<string, GraphChip[]> {
  return buildCallers(factories, {
    pipelines: toHydratedMap(relatedObjects.factoryPipelineMap, (dto) =>
      hydrateFactoryPipelineFromMap(dto, relatedObjects)
    ),
    branches: toHydratedMap(relatedObjects.factoryBranchMap, (dto) =>
      hydrateFactoryBranchFromMap(dto, relatedObjects)
    ),
    transitions: toHydratedMap(relatedObjects.transitionsMap, (dto) =>
      hydrateTwinFlowTransitionFromMap(dto, relatedObjects)
    ),
    twinflowFactories: toHydratedMap(relatedObjects.twinflowFactoryMap, (dto) =>
      hydrateTwinFlowFactoryFromMap(dto, relatedObjects)
    ),
  });
}

/**
 * Folds the searched-for callers into the ones the cascade already delivered,
 * keeping each caller once — the root factory is in both answers.
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

/** Resolves one usage into the chip for the entity that holds the reference. */
function usageChip(
  usage: FactoryUsage,
  {
    pipelines,
    branches,
    transitions,
    twinflowFactories,
  }: Pick<
    FactoryCascadeIndex,
    "pipelines" | "branches" | "transitions" | "twinflowFactories"
  >
): GraphChip | undefined {
  const id = usage.id;
  if (!isPopulatedString(id)) return undefined;

  switch (usage.usageType) {
    case "FACTORY_PIPELINE_NEXT_FACTORY":
    case "FACTORY_PIPELINE_AFTER_COMMIT_FACTORY": {
      const pipeline = pipelines.get(id);

      return pipeline
        ? {
            id: `caller:pipeline:${id}`,
            kind: "pipeline",
            entity: pipeline,
            inactive: isFalsy(pipeline.active),
          }
        : undefined;
    }
    case "FACTORY_BRANCH_NEXT_FACTORY": {
      const branch = branches.get(id);

      return branch
        ? {
            id: `caller:branch:${id}`,
            kind: "branch",
            entity: branch,
            inactive: isFalsy(branch.active),
          }
        : undefined;
    }
    case "TWINFLOW_TRANSITION_INBUILT_FACTORY": {
      const transition = transitions.get(id);

      return transition
        ? {
            id: `caller:transition:${id}`,
            kind: "transition",
            entity: transition,
          }
        : undefined;
    }
    case "TWINFLOW_FACTORY_LAUNCHER": {
      const twinflowFactory = twinflowFactories.get(id);

      return twinflowFactory
        ? {
            id: `caller:twinflow-factory:${id}`,
            kind: "twinflowFactory",
            entity: twinflowFactory,
          }
        : undefined;
    }
    default:
      // A usage kind this build does not know yet: nothing to draw it with.
      return undefined;
  }
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
