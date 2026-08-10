import { Factory } from "@/entities/factory";
import { FactoryBranch } from "@/entities/factory-branch";
import { FactoryCondition } from "@/entities/factory-condition";
import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { FactoryEraser } from "@/entities/factory-eraser";
import { FactoryMultiplier } from "@/entities/factory-multiplier";
import { FactoryMultiplierFilter } from "@/entities/factory-multiplier-filter";
import { FactoryPipeline } from "@/entities/factory-pipeline";
import { PipelineStep } from "@/entities/factory-pipeline-step";

/**
 * Which entity the Node view panel is expanded on. `kind` picks the diagram
 * builder; `id` is the entity the diagram is built around. A group selection
 * ("all multipliers of this factory") carries no `id`.
 */
export type FactoryGraphSelection =
  | { kind: "multipliers"; factoryId: string }
  | { kind: "erasers"; factoryId: string }
  | { kind: "conditionSets"; factoryId: string }
  | { kind: "pipeline"; factoryId: string; id: string };

export function isSameSelection(
  left: FactoryGraphSelection | undefined,
  right: FactoryGraphSelection | undefined
): boolean {
  if (!left || !right) return left === right;
  if (left.kind !== right.kind || left.factoryId !== right.factoryId)
    return false;

  return (
    (left.kind === "pipeline" ? left.id : undefined) ===
    (right.kind === "pipeline" ? right.id : undefined)
  );
}

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
  | { entity: "multiplierFilter"; multiplierId: string }
  /** A pipeline/branch that has no `nextFactoryId` yet. */
  | { entity: "nextFactory"; pipelineId?: string; branchId?: string };

/**
 * Node shapes of the reference diagrams. `decision` is the diamond, `outcome`
 * the thin outlined box under a pipeline, `placeholder` the dashed "Add …" box.
 */
export type DiagramNodeKind =
  | "factory"
  | "entity"
  | "decision"
  | "outcome"
  | "placeholder";

/**
 * A chip on the rail beside a factory node — its multipliers, erasers or
 * condition sets. Populated collections expand in the Node view; empty ones
 * become the dashed "Add …" chip of the references.
 */
export type FactoryChip = {
  id: string;
  label: string;
  count?: number;
  selection?: FactoryGraphSelection;
  create?: FactoryCreateTarget;
};

export type DiagramNode = {
  id: string;
  kind: DiagramNodeKind;
  label: string;
  /** Second line, e.g. a featurer name or an input class. */
  sublabel?: string;
  /**
   * Palette slot. Every node of one factory's subtree shares a slot, which is
   * what makes the nested factories readable in the reference screens.
   */
  tone: number;
  /** Expands this node in the Node view panel when clicked. */
  selection?: FactoryGraphSelection;
  /** Opens the create sheet when clicked. */
  create?: FactoryCreateTarget;
  /** Navigation target for the entity behind the node. */
  href?: string;
  /** Factory nodes only — rendered as a rail on the node's right side. */
  chips?: FactoryChip[];
  width: number;
  height: number;
};

export type DiagramEdge = {
  id: string;
  source: string;
  target: string;
  /** Dashed edges lead to placeholders, matching the references. */
  dashed?: boolean;
};

export type Diagram = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
};

/**
 * Flat view of one cascade response. The API hands back id lists on the
 * entities and the entities themselves in `relatedObjects`, so every builder
 * resolves through these maps.
 */
export type FactoryCascadeIndex = {
  root: Factory;
  factories: Map<string, Factory>;
  pipelines: Map<string, FactoryPipeline>;
  steps: Map<string, PipelineStep>;
  branches: Map<string, FactoryBranch>;
  multipliers: Map<string, FactoryMultiplier>;
  multiplierFilters: Map<string, FactoryMultiplierFilter>;
  erasers: Map<string, FactoryEraser>;
  conditionSets: Map<string, FactoryConditionSet>;
  conditions: Map<string, FactoryCondition>;
  twinClassNameById: Map<string, string>;
  statusNameById: Map<string, string>;
};
