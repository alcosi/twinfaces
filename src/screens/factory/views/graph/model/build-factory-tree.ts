import { Factory } from "@/entities/factory";
import { PlatformArea } from "@/shared/config";
import { isPopulatedString, isTruthy } from "@/shared/libs";

import { getFactoryLabel, getTwinClassLabel, resolveAll } from "./cascade";
import { NODE_SIZE } from "./constants";
import {
  Diagram,
  DiagramEdge,
  DiagramNode,
  FactoryCascadeIndex,
} from "./types";

/**
 * Builds the Factory tree panel: the current factory at the top, then one
 * column per pipeline and per branch, each descending into the factory it hands
 * over to. Dashed nodes are the create affordances.
 *
 * Nodes carry no coordinates — elk lays the graph out downwards at render time.
 */
export function buildFactoryTreeDiagram(index: FactoryCascadeIndex): Diagram {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  /** Guards cycles and shared sub-factories: each factory is expanded once. */
  const expanded = new Set<string>();
  let nextTone = 0;

  function push(node: DiagramNode): string {
    nodes.push(node);
    return node.id;
  }

  function connect(source: string, target: string, dashed?: boolean) {
    edges.push({ id: `${source}->${target}`, source, target, dashed });
  }

  /**
   * A condition-set gate. Present sets render as a solid diamond, absent ones as
   * the dashed "add condition set" diamond of the references.
   */
  function pushConditionSetGate({
    idPrefix,
    conditionSetId,
    factoryId,
    tone,
  }: {
    idPrefix: string;
    conditionSetId: string | undefined;
    factoryId: string;
    tone: number;
  }): string {
    const conditionSet = isPopulatedString(conditionSetId)
      ? index.conditionSets.get(conditionSetId)
      : undefined;

    if (conditionSet) {
      return push({
        id: `${idPrefix}:condition-set`,
        kind: "decision",
        label: "condition set",
        sublabel: conditionSet.name,
        tone,
        selection: { kind: "conditionSets", factoryId },
        ...NODE_SIZE.decision,
      });
    }

    return push({
      id: `${idPrefix}:add-condition-set`,
      kind: "decision",
      label: "add condition set",
      tone,
      create: { entity: "conditionSet", factoryId },
      ...NODE_SIZE.decision,
    });
  }

  /**
   * Either descends into the factory a pipeline/branch hands over to, or offers
   * the dashed "Add next factory" placeholder.
   */
  function pushHandover({
    idPrefix,
    nextFactoryId,
    create,
    tone,
  }: {
    idPrefix: string;
    nextFactoryId: string | undefined;
    create: DiagramNode["create"];
    tone: number;
  }): string {
    const nextFactory = isPopulatedString(nextFactoryId)
      ? index.factories.get(nextFactoryId)
      : undefined;

    if (nextFactory && isPopulatedString(nextFactory.id)) {
      return expandFactory(nextFactory.id);
    }

    return push({
      id: `${idPrefix}:add-next-factory`,
      kind: "placeholder",
      label: "Add next factory",
      tone,
      create,
      ...NODE_SIZE.placeholder,
    });
  }

  /**
   * The three collections that hang off a factory. A populated one expands in
   * the Node view; an empty one turns into its create affordance.
   */
  function buildChips(factoryId: string, factory: Factory | undefined) {
    const specs = [
      {
        id: "multipliers",
        label: "Multipliers",
        count: factory?.multiplierIdList?.length ?? 0,
        selection: { kind: "multipliers", factoryId } as const,
        create: { entity: "multiplier", factoryId } as const,
      },
      {
        id: "erasers",
        label: "Erasers",
        count: factory?.eraserIdList?.length ?? 0,
        selection: { kind: "erasers", factoryId } as const,
        create: { entity: "eraser", factoryId } as const,
      },
      {
        id: "conditionSets",
        label: "Condition sets",
        count: factory?.conditionSetIdList?.length ?? 0,
        selection: { kind: "conditionSets", factoryId } as const,
        create: { entity: "conditionSet", factoryId } as const,
      },
    ];

    return specs.map(({ id, label, count, selection, create }) =>
      count > 0
        ? { id: `${factoryId}:${id}`, label, count, selection }
        : {
            id: `${factoryId}:${id}`,
            label: `Add ${label.toLowerCase()}`,
            create,
          }
    );
  }

  function expandFactory(factoryId: string): string {
    const nodeId = `factory:${factoryId}`;

    // Already drawn elsewhere in the tree (a shared or cyclic hand-over): link
    // back to the existing node instead of duplicating the whole subtree. Bail
    // out before claiming a palette slot, so tones stay contiguous.
    if (expanded.has(factoryId)) return nodeId;
    expanded.add(factoryId);

    const factory = index.factories.get(factoryId);
    const tone = nextTone++;

    const pipelines = resolveAll(factory?.pipelineIdList, index.pipelines);
    const branches = resolveAll(factory?.branchIdList, index.branches);

    push({
      id: nodeId,
      kind: "factory",
      label: getFactoryLabel(factory),
      sublabel: factory?.key,
      tone,
      href: `/${PlatformArea.core}/factories/${factoryId}`,
      // The chip rail is rendered inside the factory node, so it stays beside
      // the title as in the reference instead of becoming another layer of the
      // layered layout.
      chips: buildChips(factoryId, factory),
      ...NODE_SIZE.factory,
    });

    push({
      id: `${nodeId}:add-pipeline`,
      kind: "placeholder",
      label: "Add pipeline",
      tone,
      create: { entity: "pipeline", factoryId },
      ...NODE_SIZE.placeholder,
    });
    connect(nodeId, `${nodeId}:add-pipeline`, true);

    pipelines.forEach((pipeline) => {
      const pipelineId = pipeline.id;
      if (!isPopulatedString(pipelineId)) return;

      const prefix = `pipeline:${pipelineId}`;

      const inputClassId = push({
        id: `${prefix}:input-class`,
        kind: "decision",
        label: "input class",
        sublabel: getTwinClassLabel(index, pipeline.inputTwinClassId),
        tone,
        ...NODE_SIZE.decision,
      });
      connect(nodeId, inputClassId);

      const gateId = pushConditionSetGate({
        idPrefix: prefix,
        conditionSetId: pipeline.factoryConditionSetId,
        factoryId,
        tone,
      });
      connect(
        inputClassId,
        gateId,
        !isPopulatedString(pipeline.factoryConditionSetId)
      );

      const pipelineNodeId = push({
        id: prefix,
        kind: "entity",
        label: isPopulatedString(pipeline.description)
          ? pipeline.description
          : "Pipeline",
        sublabel: `${pipeline.factoryPipelineStepsCount ?? 0} step(s)`,
        tone,
        selection: { kind: "pipeline", factoryId, id: pipelineId },
        href: `/${PlatformArea.core}/pipelines/${pipelineId}`,
        ...NODE_SIZE.entity,
      });
      connect(gateId, pipelineNodeId);

      const outputStatusName = getStatusLabel(pipeline.outputTwinStatusId);
      const outcomeId = push({
        id: `${prefix}:outcome`,
        kind: "outcome",
        label: outputStatusName
          ? `Set status: ${outputStatusName}`
          : "Set output status",
        tone,
        ...NODE_SIZE.outcome,
      });
      connect(pipelineNodeId, outcomeId);

      const handoverId = pushHandover({
        idPrefix: prefix,
        nextFactoryId: pipeline.nextFactoryId,
        create: { entity: "nextFactory", pipelineId },
        tone,
      });
      connect(
        outcomeId,
        handoverId,
        !isPopulatedString(pipeline.nextFactoryId)
      );
    });

    branches.forEach((branch) => {
      const branchId = branch.id;
      if (!isPopulatedString(branchId)) return;

      const prefix = `branch:${branchId}`;

      const gateId = pushConditionSetGate({
        idPrefix: prefix,
        conditionSetId: branch.factoryConditionSetId,
        factoryId,
        tone,
      });
      connect(nodeId, gateId, !isPopulatedString(branch.factoryConditionSetId));

      const branchNodeId = push({
        id: prefix,
        kind: "entity",
        label: isPopulatedString(branch.description)
          ? branch.description
          : "Branch",
        sublabel: isTruthy(branch.active) ? undefined : "inactive",
        tone,
        href: `/${PlatformArea.core}/branches/${branchId}`,
        ...NODE_SIZE.entity,
      });
      connect(gateId, branchNodeId);

      const handoverId = pushHandover({
        idPrefix: prefix,
        nextFactoryId: branch.nextFactoryId,
        create: { entity: "nextFactory", branchId },
        tone,
      });
      connect(
        branchNodeId,
        handoverId,
        !isPopulatedString(branch.nextFactoryId)
      );
    });

    push({
      id: `${nodeId}:add-branch`,
      kind: "placeholder",
      label: "Add branch",
      tone,
      create: { entity: "branch", factoryId },
      ...NODE_SIZE.placeholder,
    });
    connect(nodeId, `${nodeId}:add-branch`, true);

    return nodeId;
  }

  function getStatusLabel(statusId: string | undefined): string | undefined {
    if (!isPopulatedString(statusId)) return undefined;
    return index.statusNameById.get(statusId);
  }

  const rootId = index.root.id;
  if (isPopulatedString(rootId)) expandFactory(rootId);

  return { nodes, edges };
}
