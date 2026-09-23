import { Factory } from "@/entities/factory";
import { FactoryBranch_DETAILED } from "@/entities/factory-branch";
import { FactoryCondition } from "@/entities/factory-condition";
import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { FactoryEraser_DETAILED } from "@/entities/factory-eraser";
import { FactoryMultiplier_DETAILED } from "@/entities/factory-multiplier";
import { FactoryMultiplierFilter_DETAILED } from "@/entities/factory-multiplier-filter";
import { FactoryPipeline_DETAILED } from "@/entities/factory-pipeline";
import { PipelineStep_DETAILED } from "@/entities/factory-pipeline-step";
import { FactoryTrigger_DETAILED } from "@/entities/factory-trigger";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { TwinStatus } from "@/entities/twin-status";
import { TwinFlowFactory_DETAILED } from "@/entities/twinflow-factory";

import { GraphNodeKind } from "./node-kinds";

/**
 * How much of each element the canvas draws.
 *
 * `simple` is the skeleton — one card per factory, multiplier, pipeline and
 * branch, each with a single line of context. `advanced` keeps that skeleton and
 * unfolds every card into its parts: the pipeline's steps, condition set, input
 * class and output status, the factory's triggers and erasers, and so on.
 */
export type GraphMode = "simple" | "advanced";

/**
 * What a dashed placeholder node creates. Each variant maps to the create sheet
 * the corresponding table already uses, pre-scoped to the parent entity.
 */
export type FactoryCreateTarget =
  | { entity: "pipeline"; factoryId: string }
  | { entity: "branch"; factoryId: string }
  | { entity: "multiplier"; factoryId: string }
  | { entity: "eraser"; factoryId: string }
  | { entity: "conditionSet"; factoryId: string }
  | { entity: "condition"; conditionSetId: string }
  | { entity: "trigger"; factoryId: string }
  | { entity: "pipelineStep"; pipelineId: string; order?: number }
  | { entity: "multiplierFilter"; multiplierId: string };

/**
 * The entity a chip stands for, paired with its kind. Chips carry the entity
 * itself rather than a flattened label because they are drawn by the app's own
 * resource link for that kind — which needs the entity to build its hover card,
 * its "Copy UUID" button and its duplicate/export menu.
 */
export type GraphChipEntity =
  | { kind: "factory"; entity: Factory }
  | { kind: "pipeline"; entity: FactoryPipeline_DETAILED }
  | { kind: "branch"; entity: FactoryBranch_DETAILED }
  | { kind: "step"; entity: PipelineStep_DETAILED }
  | { kind: "multiplier"; entity: FactoryMultiplier_DETAILED }
  | { kind: "multiplierFilter"; entity: FactoryMultiplierFilter_DETAILED }
  | { kind: "conditionSet"; entity: FactoryConditionSet }
  | { kind: "eraser"; entity: FactoryEraser_DETAILED }
  | { kind: "trigger"; entity: FactoryTrigger_DETAILED }
  | { kind: "twinClass"; entity: TwinClass_DETAILED }
  | { kind: "status"; entity: TwinStatus }
  /** A transition whose in-built factory is this one. */
  | { kind: "transition"; entity: TwinFlowTransition_DETAILED }
  /** A twinflow launching this factory. */
  | { kind: "twinflowFactory"; entity: TwinFlowFactory_DETAILED };

/** A chip inside an advanced card's section — one related entity. */
export type GraphChip = {
  id: string;
  /**
   * `active: false` entities are drawn as disabled resource links: still
   * readable, with their hover card intact, but no longer a way in.
   */
  inactive?: boolean;
} & GraphChipEntity;

/**
 * One block of an advanced card: a caption and the chips under it. `handover`
 * is the "NEXT FACTORY" block, which the design draws as a field rather than as
 * a plain list.
 */
export type GraphSection = {
  id: string;
  label: string;
  chips: GraphChip[];
  variant?: "list" | "handover";
};

export type DiagramNodeKind = GraphNodeKind | "placeholder";

/**
 * Which element a create affordance stands in for. A placeholder is drawn in the
 * colours of whatever it would add, so an "Add branch" reads as a branch before
 * it exists.
 */
export const CREATE_TARGET_KIND: Record<
  FactoryCreateTarget["entity"],
  GraphNodeKind
> = {
  pipeline: "pipeline",
  branch: "branch",
  multiplier: "multiplier",
  eraser: "eraser",
  conditionSet: "conditionSet",
  condition: "conditionSet",
  trigger: "trigger",
  pipelineStep: "step",
  multiplierFilter: "multiplierFilter",
};

export type DiagramNode = {
  id: string;
  kind: DiagramNodeKind;
  label: string;
  /** Simple mode's single line of context — "key: F01", "input: Task". */
  sublabel?: string;
  /** Advanced mode's header blurb, clamped to {@link CARD.descriptionLines}. */
  description?: string;
  /** Advanced mode only. */
  sections?: GraphSection[];
  /** Navigation target for the entity behind the node. */
  href?: string;
  /** Opens the create sheet when clicked — placeholders only. */
  create?: FactoryCreateTarget;
  /**
   * Placeholders only: the element this one stands in for, which is what it
   * borrows its colour from. An "Add branch" reads as a branch before it exists.
   */
  accentKind?: GraphNodeKind;
  /** `active: false` entities are drawn dimmed and marked disabled. */
  inactive?: boolean;
  /** The factory group this node is drawn inside of. */
  groupId?: string;
  /**
   * Row of the group this node belongs to: the factory card, then multipliers,
   * then pipelines and branches, then the hand-over placeholders. Layout keys
   * off it instead of off the edges, so a row stays a row even when its nodes
   * hang off the factory card directly.
   */
  partition: number;
  width: number;
  height: number;
};

/**
 * The dashed container drawn around everything one factory owns — the `F01`,
 * `FB2`, `F05` boxes of the design. Laid out by elk as a parent node, so its
 * size follows its contents.
 */
export type DiagramGroup = {
  id: string;
  /** Caption at the top-left corner — the factory's key. */
  label: string;
};

export type DiagramEdge = {
  id: string;
  source: string;
  target: string;
  /** Dashed edges lead to placeholders, matching the design. */
  dashed?: boolean;
};

export type Diagram = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups: DiagramGroup[];
  /** The level of detail the nodes were built at — the cards render by it. */
  mode: GraphMode;
};

/**
 * Flat view of one cascade response. The API hands back id lists on the
 * entities and the entities themselves in `relatedObjects`, so every builder
 * resolves through these maps.
 *
 * Entries are hydrated on the way in — each entity's own `hydrate*FromMap`
 * folds the related maps back into it — so a chip can hand a whole entity to a
 * resource link instead of the bare DTO the cascade delivered.
 */
export type FactoryCascadeIndex = {
  root: Factory;
  factories: Map<string, Factory>;
  pipelines: Map<string, FactoryPipeline_DETAILED>;
  steps: Map<string, PipelineStep_DETAILED>;
  branches: Map<string, FactoryBranch_DETAILED>;
  multipliers: Map<string, FactoryMultiplier_DETAILED>;
  multiplierFilters: Map<string, FactoryMultiplierFilter_DETAILED>;
  erasers: Map<string, FactoryEraser_DETAILED>;
  conditionSets: Map<string, FactoryConditionSet>;
  conditions: Map<string, FactoryCondition>;
  triggers: Map<string, FactoryTrigger_DETAILED>;
  twinClasses: Map<string, TwinClass_DETAILED>;
  statuses: Map<string, TwinStatus>;
  transitions: Map<string, TwinFlowTransition_DETAILED>;
  twinflowFactories: Map<string, TwinFlowFactory_DETAILED>;
  /**
   * Everything that leads into a given factory — the "Called From" block. Read
   * straight off each factory's `usages`, so it covers the ways in that the
   * canvas cannot draw: a pipeline of an unrelated factory, a transition's
   * in-built factory, a twinflow launcher.
   */
  callersByFactoryId: Map<string, GraphChip[]>;
};
