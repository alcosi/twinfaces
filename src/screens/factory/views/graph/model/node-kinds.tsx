import {
  Copy,
  Factory as FactoryIcon,
  Filter,
  Trash2,
  Zap,
} from "lucide-react";
import { ElementType } from "react";

import { FactoryBranchIcon } from "@/features/factory-branch/ui";
import { FactoryConditionSetIcon } from "@/features/factory-condition-set/ui";
import { FactoryPipelineStepIcon } from "@/features/factory-pipeline-step/ui";
import { FactoryPipelineIcon } from "@/features/factory-pipeline/ui";
import { TwinClassIcon } from "@/features/twin-class/ui";
import { TwinStatusIcon } from "@/features/twin-status/ui";

/** Every element the graph draws as a card, plus the chips inside those cards. */
export type GraphNodeKind =
  | "factory"
  | "trigger"
  | "pipeline"
  | "step"
  | "branch"
  | "multiplier"
  | "multiplierFilter"
  | "conditionSet"
  | "eraser"
  /** Not an element of its own — the twin class a node reads or writes. */
  | "twinClass"
  /** Likewise: the status a pipeline hands its twin over in. */
  | "status";

type NodeKindStyle = {
  Icon: ElementType;
  /** Wash behind the icon. */
  tint: string;
  /**
   * The kind's own colour, as a text colour: the icon takes it, and so does
   * everything that draws with `currentColor` — the dashed outline of a create
   * affordance included.
   */
  accent: string;
  label: string;
};

/**
 * One source of truth for how each element of the graph looks. Both the card
 * headers and the chips inside a card read from it, so an eraser is the same
 * red trash can wherever it shows up.
 *
 * Icons are the app's own entity icons wherever one exists, so a pipeline in the
 * graph is the pipeline of every table and resource link; the rest come from
 * lucide. Tints are fixed palette colours rather than theme tokens — the cards
 * are the one place where colour carries meaning (which element is which) and
 * has to survive both themes, so each pairs a 10% wash with a mid-tone icon.
 */
export const NODE_KIND_STYLES: Record<GraphNodeKind, NodeKindStyle> = {
  factory: {
    Icon: FactoryIcon,
    tint: "bg-blue-500/10",
    accent: "text-blue-600 dark:text-blue-400",
    label: "Factory",
  },
  trigger: {
    Icon: Zap,
    tint: "bg-amber-500/10",
    accent: "text-amber-600 dark:text-amber-400",
    label: "Trigger",
  },
  pipeline: {
    Icon: FactoryPipelineIcon,
    tint: "bg-teal-500/10",
    accent: "text-teal-600 dark:text-teal-400",
    label: "Pipeline",
  },
  step: {
    Icon: FactoryPipelineStepIcon,
    tint: "bg-cyan-500/10",
    accent: "text-cyan-600 dark:text-cyan-400",
    label: "Step",
  },
  branch: {
    Icon: FactoryBranchIcon,
    tint: "bg-violet-500/10",
    accent: "text-violet-600 dark:text-violet-400",
    label: "Branch",
  },
  multiplier: {
    Icon: Copy,
    tint: "bg-emerald-500/10",
    accent: "text-emerald-600 dark:text-emerald-400",
    label: "Multiplier",
  },
  multiplierFilter: {
    Icon: Filter,
    tint: "bg-emerald-500/10",
    accent: "text-emerald-600 dark:text-emerald-400",
    label: "Multiplier filter",
  },
  conditionSet: {
    Icon: FactoryConditionSetIcon,
    tint: "bg-rose-500/10",
    accent: "text-rose-600 dark:text-rose-400",
    label: "Condition set",
  },
  eraser: {
    Icon: Trash2,
    tint: "bg-rose-500/10",
    accent: "text-rose-600 dark:text-rose-400",
    label: "Eraser",
  },
  twinClass: {
    Icon: TwinClassIcon,
    tint: "bg-slate-500/10",
    accent: "text-slate-600 dark:text-slate-400",
    label: "Twin class",
  },
  status: {
    Icon: TwinStatusIcon,
    tint: "bg-slate-500/10",
    accent: "text-slate-600 dark:text-slate-400",
    label: "Status",
  },
};

export function getNodeKindStyle(kind: GraphNodeKind): NodeKindStyle {
  return NODE_KIND_STYLES[kind];
}
