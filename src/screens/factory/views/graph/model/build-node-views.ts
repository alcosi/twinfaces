import { PlatformArea } from "@/shared/config";
import { isPopulatedString } from "@/shared/libs";

import { getFactoryLabel, getTwinClassLabel, resolveAll } from "./cascade";
import { NODE_SIZE } from "./constants";
import {
  Diagram,
  DiagramEdge,
  DiagramNode,
  FactoryCascadeIndex,
  FactoryGraphSelection,
} from "./types";

/** Tone of the factory the node view is scoped to; keeps it visually attached. */
const VIEW_TONE = 0;

/**
 * Collects nodes and edges for one node view. Every view opens and closes on the
 * owning factory, as in the references, so the helper hands out both terminals.
 */
function createBuilder(index: FactoryCascadeIndex, factoryId: string) {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const factory = index.factories.get(factoryId);
  const factoryLabel = getFactoryLabel(factory);

  function push(node: DiagramNode): string {
    nodes.push(node);
    return node.id;
  }

  function connect(source: string, target: string, dashed?: boolean) {
    edges.push({ id: `${source}->${target}`, source, target, dashed });
  }

  const entryId = push({
    id: "view:factory-entry",
    kind: "factory",
    label: factoryLabel,
    sublabel: factory?.key,
    tone: VIEW_TONE,
    href: `/${PlatformArea.core}/factories/${factoryId}`,
    ...NODE_SIZE.factory,
  });

  /** The closing factory node, appended last so it lands in the bottom layer. */
  function pushExit(): string {
    return push({
      id: "view:factory-exit",
      kind: "factory",
      label: factoryLabel,
      tone: VIEW_TONE,
      href: `/${PlatformArea.core}/factories/${factoryId}`,
      ...NODE_SIZE.factory,
    });
  }

  /**
   * A condition-set gate; solid when the entity references one, dashed "add
   * condition set" otherwise.
   */
  function pushGate(idPrefix: string, conditionSetId: string | undefined) {
    const conditionSet = isPopulatedString(conditionSetId)
      ? index.conditionSets.get(conditionSetId)
      : undefined;

    if (conditionSet) {
      return push({
        id: `${idPrefix}:condition-set`,
        kind: "decision",
        label: "condition set",
        sublabel: conditionSet.name,
        tone: VIEW_TONE,
        ...NODE_SIZE.decision,
      });
    }

    return push({
      id: `${idPrefix}:add-condition-set`,
      kind: "decision",
      label: "add condition set",
      tone: VIEW_TONE,
      create: { entity: "conditionSet", factoryId },
      ...NODE_SIZE.decision,
    });
  }

  function pushInputClass(idPrefix: string, twinClassId: string | undefined) {
    return push({
      id: `${idPrefix}:input-class`,
      kind: "decision",
      label: "input class",
      sublabel: getTwinClassLabel(index, twinClassId),
      tone: VIEW_TONE,
      ...NODE_SIZE.decision,
    });
  }

  return {
    nodes,
    edges,
    factory,
    entryId,
    push,
    connect,
    pushExit,
    pushGate,
    pushInputClass,
  };
}

/**
 * Multipliers view: the factory fans out into one column per multiplier — each
 * gated by its input class — and every multiplier's filters hang below it as an
 * input-class / condition-set pair. All columns rejoin the factory at the
 * bottom.
 */
function buildMultipliersDiagram(
  index: FactoryCascadeIndex,
  factoryId: string
): Diagram {
  const b = createBuilder(index, factoryId);
  const multipliers = resolveAll(
    b.factory?.multiplierIdList,
    index.multipliers
  );

  const addMultiplierId = b.push({
    id: "view:add-multiplier",
    kind: "placeholder",
    label: "Add multiplier",
    tone: VIEW_TONE,
    create: { entity: "multiplier", factoryId },
    ...NODE_SIZE.placeholder,
  });
  b.connect(b.entryId, addMultiplierId, true);

  /** Column tails that must be wired to the closing factory node. */
  const tails: string[] = [];

  multipliers.forEach((multiplier) => {
    const multiplierId = multiplier.id;
    if (!isPopulatedString(multiplierId)) return;

    const prefix = `multiplier:${multiplierId}`;

    const inputClassId = b.pushInputClass(prefix, multiplier.inputTwinClassId);
    b.connect(b.entryId, inputClassId);

    const multiplierNodeId = b.push({
      id: prefix,
      kind: "entity",
      label: isPopulatedString(multiplier.description)
        ? multiplier.description
        : "Multiplier",
      sublabel: `${multiplier.filterIdList?.length ?? 0} filter(s)`,
      tone: VIEW_TONE,
      href: `/${PlatformArea.core}/multipliers/${multiplierId}`,
      ...NODE_SIZE.entity,
    });
    b.connect(inputClassId, multiplierNodeId);

    const addFilterId = b.push({
      id: `${prefix}:add-filter`,
      kind: "placeholder",
      label: "Add filter",
      tone: VIEW_TONE,
      create: { entity: "multiplierFilter", multiplierId },
      ...NODE_SIZE.placeholder,
    });
    b.connect(multiplierNodeId, addFilterId, true);
    tails.push(addFilterId);

    resolveAll(multiplier.filterIdList, index.multiplierFilters).forEach(
      (filter) => {
        const filterId = filter.id;
        if (!isPopulatedString(filterId)) return;

        const filterPrefix = `filter:${filterId}`;
        const filterInputId = b.pushInputClass(
          filterPrefix,
          filter.inputTwinClassId
        );
        b.connect(multiplierNodeId, filterInputId);

        const gateId = b.pushGate(filterPrefix, filter.factoryConditionSetId);
        b.connect(filterInputId, gateId);
        tails.push(gateId);
      }
    );
  });

  const exitId = b.pushExit();
  tails.forEach((tail) => b.connect(tail, exitId));
  if (tails.length === 0) b.connect(b.entryId, exitId);

  return { nodes: b.nodes, edges: b.edges };
}

/**
 * Pipeline view: the pipeline's steps as a vertical chain. Each step is preceded
 * by its condition-set gate and by the "Add step" affordance that inserts ahead
 * of it; a trailing "Add step" appends to the end.
 */
function buildPipelineDiagram(
  index: FactoryCascadeIndex,
  factoryId: string,
  pipelineId: string
): Diagram {
  const b = createBuilder(index, factoryId);
  const pipeline = index.pipelines.get(pipelineId);
  const steps = resolveAll(pipeline?.stepIdList, index.steps).sort(
    (left, right) => (left.order ?? 0) - (right.order ?? 0)
  );

  let cursor = b.entryId;

  steps.forEach((step, position) => {
    const stepId = step.id;
    if (!isPopulatedString(stepId)) return;

    const prefix = `step:${stepId}`;

    const addStepId = b.push({
      id: `${prefix}:add-step-before`,
      kind: "placeholder",
      label: "Add step",
      tone: VIEW_TONE,
      create: {
        entity: "pipelineStep",
        pipelineId,
        order: step.order ?? position,
      },
      ...NODE_SIZE.placeholder,
    });
    b.connect(cursor, addStepId, true);

    const gateId = b.pushGate(prefix, step.factoryConditionSetId);
    b.connect(
      addStepId,
      gateId,
      !isPopulatedString(step.factoryConditionSetId)
    );

    const stepNodeId = b.push({
      id: prefix,
      kind: "entity",
      label: isPopulatedString(step.description)
        ? step.description
        : `Step ${step.order ?? position + 1}`,
      sublabel: step.optional ? "optional" : undefined,
      tone: VIEW_TONE,
      href: `/${PlatformArea.core}/pipeline-steps/${stepId}`,
      ...NODE_SIZE.entity,
    });
    b.connect(gateId, stepNodeId);

    cursor = stepNodeId;
  });

  const addLastId = b.push({
    id: "view:add-step-last",
    kind: "placeholder",
    label: "Add step",
    tone: VIEW_TONE,
    create: { entity: "pipelineStep", pipelineId, order: steps.length },
    ...NODE_SIZE.placeholder,
  });
  b.connect(cursor, addLastId, true);

  const exitId = b.pushExit();
  b.connect(addLastId, exitId, true);

  return { nodes: b.nodes, edges: b.edges };
}

/**
 * Erasers view: one column per eraser — input class, then its condition-set
 * gate — rejoining the factory at the bottom.
 */
function buildErasersDiagram(
  index: FactoryCascadeIndex,
  factoryId: string
): Diagram {
  const b = createBuilder(index, factoryId);
  const erasers = resolveAll(b.factory?.eraserIdList, index.erasers);

  const addEraserId = b.push({
    id: "view:add-eraser",
    kind: "placeholder",
    label: "Add eraser",
    tone: VIEW_TONE,
    create: { entity: "eraser", factoryId },
    ...NODE_SIZE.placeholder,
  });
  b.connect(b.entryId, addEraserId, true);

  const tails: string[] = [];

  erasers.forEach((eraser) => {
    const eraserId = eraser.id;
    if (!isPopulatedString(eraserId)) return;

    const prefix = `eraser:${eraserId}`;

    const inputClassId = b.pushInputClass(prefix, eraser.inputTwinClassId);
    b.connect(b.entryId, inputClassId);

    const gateId = b.pushGate(prefix, eraser.factoryConditionSetId);
    b.connect(inputClassId, gateId);

    const eraserNodeId = b.push({
      id: prefix,
      kind: "entity",
      label: isPopulatedString(eraser.description)
        ? eraser.description
        : "Eraser",
      sublabel: eraser.action === "NOT_SPECIFIED" ? undefined : eraser.action,
      tone: VIEW_TONE,
      href: `/${PlatformArea.core}/erasers/${eraserId}`,
      ...NODE_SIZE.entity,
    });
    b.connect(gateId, eraserNodeId);
    tails.push(eraserNodeId);
  });

  const exitId = b.pushExit();
  tails.forEach((tail) => b.connect(tail, exitId));
  if (tails.length === 0) b.connect(b.entryId, exitId);

  return { nodes: b.nodes, edges: b.edges };
}

/**
 * Condition sets view: each set of the factory with its conditions beneath it.
 */
function buildConditionSetsDiagram(
  index: FactoryCascadeIndex,
  factoryId: string
): Diagram {
  const b = createBuilder(index, factoryId);
  const conditionSets = resolveAll(
    b.factory?.conditionSetIdList,
    index.conditionSets
  );

  const addSetId = b.push({
    id: "view:add-condition-set",
    kind: "placeholder",
    label: "Add condition set",
    tone: VIEW_TONE,
    create: { entity: "conditionSet", factoryId },
    ...NODE_SIZE.placeholder,
  });
  b.connect(b.entryId, addSetId, true);

  conditionSets.forEach((conditionSet) => {
    const conditionSetId = conditionSet.id;
    if (!isPopulatedString(conditionSetId)) return;

    const prefix = `condition-set:${conditionSetId}`;

    const setNodeId = b.push({
      id: prefix,
      kind: "decision",
      label: "condition set",
      sublabel: conditionSet.name,
      tone: VIEW_TONE,
      href: `/${PlatformArea.core}/condition-sets/${conditionSetId}`,
      ...NODE_SIZE.decision,
    });
    b.connect(b.entryId, setNodeId);

    resolveAll(conditionSet.conditionIdList, index.conditions).forEach(
      (condition) => {
        const conditionId = condition.id;
        if (!isPopulatedString(conditionId)) return;

        const conditionNodeId = b.push({
          id: `condition:${conditionId}`,
          kind: "entity",
          label: isPopulatedString(condition.description)
            ? condition.description
            : "Condition",
          sublabel: condition.invert ? "inverted" : undefined,
          tone: VIEW_TONE,
          href: `/${PlatformArea.core}/conditions/${conditionId}`,
          ...NODE_SIZE.entity,
        });
        b.connect(setNodeId, conditionNodeId);
      }
    );

    // Conditions are what a set is actually made of, so each set carries its own
    // create affordance rather than relying on the conditions table.
    const addConditionId = b.push({
      id: `${prefix}:add-condition`,
      kind: "placeholder",
      label: "Add condition",
      tone: VIEW_TONE,
      create: { entity: "condition", conditionSetId },
      ...NODE_SIZE.placeholder,
    });
    b.connect(setNodeId, addConditionId, true);
  });

  return { nodes: b.nodes, edges: b.edges };
}

/** Dispatches to the diagram builder the current selection asks for. */
export function buildNodeViewDiagram(
  index: FactoryCascadeIndex,
  selection: FactoryGraphSelection
): Diagram {
  switch (selection.kind) {
    case "multipliers":
      return buildMultipliersDiagram(index, selection.factoryId);
    case "erasers":
      return buildErasersDiagram(index, selection.factoryId);
    case "conditionSets":
      return buildConditionSetsDiagram(index, selection.factoryId);
    case "pipeline":
      return buildPipelineDiagram(index, selection.factoryId, selection.id);
  }
}

/** Panel heading for the current selection. */
export function getNodeViewTitle(
  index: FactoryCascadeIndex,
  selection: FactoryGraphSelection
): string {
  const factoryLabel = getFactoryLabel(
    index.factories.get(selection.factoryId)
  );

  if (selection.kind === "pipeline") {
    const pipeline = index.pipelines.get(selection.id);
    const label = isPopulatedString(pipeline?.description)
      ? pipeline.description
      : "Pipeline";
    return `${factoryLabel} · ${label}`;
  }

  const titles = {
    multipliers: "Multipliers",
    erasers: "Erasers",
    conditionSets: "Condition sets",
  } as const;

  return `${factoryLabel} · ${titles[selection.kind]}`;
}
