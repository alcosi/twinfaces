import { Factory } from "@/entities/factory";
import { PlatformArea } from "@/shared/config";
import { isFalsy, isPopulatedString } from "@/shared/libs";

import { getFactoryLabel, getTwinClassLabel, resolveAll } from "./cascade";
import { GRAPH_ROW as ROW, measureNode } from "./constants";
import { GraphNodeKind } from "./node-kinds";
import {
  CREATE_TARGET_KIND,
  Diagram,
  DiagramEdge,
  DiagramGroup,
  DiagramNode,
  FactoryCascadeIndex,
  FactoryCreateTarget,
  GraphChip,
  GraphMode,
  GraphSection,
} from "./types";

/**
 * Builds the whole canvas: one dashed group per factory of the cascade, holding
 * that factory's card, its multipliers, and its pipelines and branches, with the
 * hand-over links running from a pipeline or branch into the next factory's
 * group. Dashed nodes are the create affordances.
 *
 * The two modes differ in what a card carries, not in the shape of the graph:
 * `simple` gives every card one line of context, `advanced` unfolds it into the
 * blocks of related entities. Nodes carry no coordinates — elk lays the graph
 * out at render time.
 */
export function buildFactoryGraph(
  index: FactoryCascadeIndex,
  mode: GraphMode
): Diagram {
  const nodes: DiagramNode[] = [];
  const edges: DiagramEdge[] = [];
  const groups: DiagramGroup[] = [];
  /** Guards cycles and shared sub-factories: each factory is expanded once. */
  const expanded = new Set<string>();

  const isAdvanced = mode === "advanced";

  function push(node: DiagramNode): string {
    nodes.push({ ...node, ...measureNode(node, mode) });
    return node.id;
  }

  function connect(source: string, target: string, dashed?: boolean) {
    edges.push({ id: `${source}->${target}`, source, target, dashed });
  }

  function pushPlaceholder({
    id,
    label,
    create,
    href,
    accentKind,
    groupId,
    partition,
    from,
  }: {
    id: string;
    label: string;
    create?: FactoryCreateTarget;
    href?: string;
    accentKind?: GraphNodeKind;
    groupId: string;
    partition: number;
    from: string;
  }) {
    push({
      id,
      kind: "placeholder",
      label,
      create,
      href,
      accentKind: accentKind ?? (create && CREATE_TARGET_KIND[create.entity]),
      groupId,
      partition,
      width: 0,
      height: 0,
    });
    connect(from, id, true);
  }

  /** A block of chips, dropped entirely when it has nothing to show. */
  function section(
    id: string,
    label: string,
    chips: (GraphChip | undefined)[],
    variant?: GraphSection["variant"]
  ): GraphSection | undefined {
    const present = chips.filter((chip): chip is GraphChip => Boolean(chip));
    if (present.length === 0) return undefined;

    return { id, label, chips: present, variant };
  }

  function sections(
    ...blocks: (GraphSection | undefined)[]
  ): GraphSection[] | undefined {
    if (!isAdvanced) return undefined;

    const present = blocks.filter((block): block is GraphSection =>
      Boolean(block)
    );

    return present.length > 0 ? present : undefined;
  }

  function twinClassChip(
    id: string,
    twinClassId: string | undefined
  ): GraphChip | undefined {
    const label = getTwinClassLabel(index, twinClassId);
    if (!label) return undefined;

    return {
      id,
      kind: "twinClass",
      label,
      href: `/${PlatformArea.core}/twinclass/${twinClassId}`,
    };
  }

  function conditionSetChip(
    id: string,
    conditionSetId: string | undefined
  ): GraphChip | undefined {
    if (!isPopulatedString(conditionSetId)) return undefined;

    const conditionSet = index.conditionSets.get(conditionSetId);
    if (!conditionSet) return undefined;

    return {
      id,
      kind: "conditionSet",
      label: isPopulatedString(conditionSet.name)
        ? conditionSet.name
        : "Condition set",
      href: `/${PlatformArea.core}/condition-sets/${conditionSetId}`,
    };
  }

  function statusChip(
    id: string,
    statusId: string | undefined
  ): GraphChip | undefined {
    if (!isPopulatedString(statusId)) return undefined;

    const label = index.statusNameById.get(statusId);
    if (!label) return undefined;

    return {
      id,
      kind: "status",
      label,
      href: `/${PlatformArea.core}/statuses/${statusId}`,
    };
  }

  function nextFactoryChip(
    id: string,
    nextFactoryId: string | undefined
  ): GraphChip | undefined {
    if (!isPopulatedString(nextFactoryId)) return undefined;

    return {
      id,
      kind: "factory",
      label: getFactoryLabel(index.factories.get(nextFactoryId)),
      href: `/${PlatformArea.core}/factories/${nextFactoryId}`,
    };
  }

  function buildFactorySections(
    factoryId: string,
    factory: Factory | undefined
  ) {
    const erasers = resolveAll(factory?.eraserIdList, index.erasers).map(
      (eraser) => ({
        id: `eraser:${eraser.id}`,
        kind: "eraser" as const,
        label: isPopulatedString(eraser.description)
          ? eraser.description
          : "Eraser",
        href: `/${PlatformArea.core}/erasers/${eraser.id}`,
        inactive: isFalsy(eraser.active),
      })
    );

    const triggers = resolveAll(factory?.triggerIdList, index.triggers).map(
      (trigger) => ({
        id: `trigger:${trigger.id}`,
        kind: "trigger" as const,
        label: isPopulatedString(trigger.description)
          ? trigger.description
          : "Trigger",
        href: `/${PlatformArea.core}/factory-triggers/${trigger.id}`,
        inactive: isFalsy(trigger.active),
      })
    );

    return sections(
      section(
        `${factoryId}:called-from`,
        "Called From",
        index.callersByFactoryId.get(factoryId) ?? []
      ),
      section(`${factoryId}:erasers`, "Erasers", erasers),
      section(`${factoryId}:triggers`, "Triggers", triggers)
    );
  }

  function expandFactory(factoryId: string): string {
    const nodeId = `factory:${factoryId}`;

    // Already drawn elsewhere (a shared or cyclic hand-over): link back to the
    // existing node instead of duplicating the whole subtree.
    if (expanded.has(factoryId)) return nodeId;
    expanded.add(factoryId);

    const factory = index.factories.get(factoryId);
    const groupId = `group:${factoryId}`;

    groups.push({
      id: groupId,
      label: isPopulatedString(factory?.key)
        ? factory.key
        : getFactoryLabel(factory),
    });

    push({
      id: nodeId,
      kind: "factory",
      label: getFactoryLabel(factory),
      sublabel: isPopulatedString(factory?.key)
        ? `key: ${factory.key}`
        : undefined,
      description: factory?.description,
      sections: buildFactorySections(factoryId, factory),
      href: `/${PlatformArea.core}/factories/${factoryId}`,
      groupId,
      partition: ROW.factory,
      width: 0,
      height: 0,
    });

    resolveAll(factory?.multiplierIdList, index.multipliers).forEach(
      (multiplier) => {
        const multiplierId = multiplier.id;
        if (!isPopulatedString(multiplierId)) return;

        const filters = resolveAll(
          multiplier.filterIdList,
          index.multiplierFilters
        ).map((filter) => ({
          id: `multiplier-filter:${filter.id}`,
          kind: "multiplierFilter" as const,
          label: isPopulatedString(filter.description)
            ? filter.description
            : "Filter",
          href: `/${PlatformArea.core}/multiplier-filters/${filter.id}`,
          inactive: isFalsy(filter.active),
        }));

        const id = push({
          id: `multiplier:${multiplierId}`,
          kind: "multiplier",
          label: isPopulatedString(multiplier.description)
            ? multiplier.description
            : "Multiplier",
          sublabel:
            getTwinClassLabel(index, multiplier.inputTwinClassId) ??
            "Multiplier slot",
          description: multiplier.description,
          sections: sections(
            section(`${multiplierId}:input-class`, "Input Class", [
              twinClassChip(
                `${multiplierId}:input`,
                multiplier.inputTwinClassId
              ),
            ]),
            section(`${multiplierId}:filters`, "Filters", filters)
          ),
          href: `/${PlatformArea.core}/multipliers/${multiplierId}`,
          inactive: isFalsy(multiplier.active),
          groupId,
          partition: ROW.multipliers,
          width: 0,
          height: 0,
        });
        connect(nodeId, id);
      }
    );

    pushPlaceholder({
      id: `${nodeId}:add-multiplier`,
      label: "Add multiplier",
      create: { entity: "multiplier", factoryId },
      groupId,
      partition: ROW.multipliers,
      from: nodeId,
    });

    pushPlaceholder({
      id: `${nodeId}:add-pipeline`,
      label: "Add pipeline",
      create: { entity: "pipeline", factoryId },
      groupId,
      partition: ROW.flow,
      from: nodeId,
    });

    resolveAll(factory?.pipelineIdList, index.pipelines).forEach((pipeline) => {
      const pipelineId = pipeline.id;
      if (!isPopulatedString(pipelineId)) return;

      const steps = resolveAll(pipeline.stepIdList, index.steps).map(
        (step) => ({
          id: `step:${step.id}`,
          kind: "step" as const,
          label: isPopulatedString(step.description)
            ? step.description
            : "Step",
          href: `/${PlatformArea.core}/pipeline-steps/${step.id}`,
          inactive: isFalsy(step.active),
        })
      );

      const inputClass = getTwinClassLabel(index, pipeline.inputTwinClassId);

      const id = push({
        id: `pipeline:${pipelineId}`,
        kind: "pipeline",
        label: isPopulatedString(pipeline.description)
          ? pipeline.description
          : "Pipeline",
        sublabel: inputClass ? `input: ${inputClass}` : undefined,
        description: pipeline.description,
        sections: sections(
          section(`${pipelineId}:input-class`, "Input Class", [
            twinClassChip(`${pipelineId}:input`, pipeline.inputTwinClassId),
          ]),
          section(`${pipelineId}:condition-set`, "Condition Set", [
            conditionSetChip(
              `${pipelineId}:condition-set`,
              pipeline.factoryConditionSetId
            ),
          ]),
          section(`${pipelineId}:steps`, "Steps", steps),
          section(`${pipelineId}:output-status`, "Output Status", [
            statusChip(`${pipelineId}:status`, pipeline.outputTwinStatusId),
          ]),
          section(
            `${pipelineId}:next-factory`,
            "Next factory",
            [nextFactoryChip(`${pipelineId}:next`, pipeline.nextFactoryId)],
            "handover"
          )
        ),
        href: `/${PlatformArea.core}/pipelines/${pipelineId}`,
        inactive: isFalsy(pipeline.active),
        groupId,
        partition: ROW.flow,
        width: 0,
        height: 0,
      });
      connect(nodeId, id);

      handOver({
        from: id,
        idPrefix: `pipeline:${pipelineId}`,
        nextFactoryId: pipeline.nextFactoryId,
        href: `/${PlatformArea.core}/pipelines/${pipelineId}`,
        groupId,
      });
    });

    resolveAll(factory?.branchIdList, index.branches).forEach((branch) => {
      const branchId = branch.id;
      if (!isPopulatedString(branchId)) return;

      const id = push({
        id: `branch:${branchId}`,
        kind: "branch",
        label: isPopulatedString(branch.description)
          ? branch.description
          : "Branch",
        sublabel: isPopulatedString(factory?.key)
          ? `child of ${factory.key}`
          : undefined,
        description: branch.description,
        sections: sections(
          section(`${branchId}:condition-set`, "Condition Set", [
            conditionSetChip(
              `${branchId}:condition-set`,
              branch.factoryConditionSetId
            ),
          ]),
          section(
            `${branchId}:next-factory`,
            "Next factory",
            [nextFactoryChip(`${branchId}:next`, branch.nextFactoryId)],
            "handover"
          )
        ),
        href: `/${PlatformArea.core}/branches/${branchId}`,
        inactive: isFalsy(branch.active),
        groupId,
        partition: ROW.flow,
        width: 0,
        height: 0,
      });
      connect(nodeId, id);

      handOver({
        from: id,
        idPrefix: `branch:${branchId}`,
        nextFactoryId: branch.nextFactoryId,
        href: `/${PlatformArea.core}/branches/${branchId}`,
        groupId,
      });
    });

    pushPlaceholder({
      id: `${nodeId}:add-branch`,
      label: "Add branch",
      create: { entity: "branch", factoryId },
      groupId,
      partition: ROW.flow,
      from: nodeId,
    });

    return nodeId;
  }

  /**
   * Either descends into the factory a pipeline or branch hands over to — which
   * draws that factory's own group — or offers the dashed placeholder.
   *
   * The placeholder links rather than opening a create sheet: the next factory
   * is a field of the pipeline or branch, not an entity of its own, so the only
   * place to set it is that entity's own page, where the field edits in place.
   */
  function handOver({
    from,
    idPrefix,
    nextFactoryId,
    href,
    groupId,
  }: {
    from: string;
    idPrefix: string;
    nextFactoryId: string | undefined;
    href: string;
    groupId: string;
  }) {
    if (isPopulatedString(nextFactoryId)) {
      return connect(from, expandFactory(nextFactoryId));
    }

    pushPlaceholder({
      id: `${idPrefix}:add-next-factory`,
      label: "Set next factory",
      href,
      accentKind: "factory",
      groupId,
      partition: ROW.handover,
      from,
    });
  }

  const rootId = index.root.id;
  if (isPopulatedString(rootId)) expandFactory(rootId);

  return { nodes, edges, groups, mode };
}
