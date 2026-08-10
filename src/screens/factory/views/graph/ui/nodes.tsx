"use client";

import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import Link from "next/link";
import { CSSProperties, MouseEvent, ReactNode } from "react";

import { cn, isPopulatedString } from "@/shared/libs";

import {
  DIAMOND_LABEL_WIDTH,
  DIAMOND_SIDE,
  DiagramNode,
  FactoryChip,
  FactoryCreateTarget,
  FactoryGraphSelection,
  getToneStyles,
  isSameSelection,
} from "../model";

export type DiagramNodeData = DiagramNode & {
  isSelected: boolean;
  /**
   * The panel's active selection. Needed on top of `isSelected` because a
   * factory node is never selected itself — its individual chips are.
   */
  currentSelection?: FactoryGraphSelection;
  onSelect: (selection: FactoryGraphSelection) => void;
  onCreate: (target: FactoryCreateTarget) => void;
};

export type DiagramFlowNode = Node<DiagramNodeData, "diagramNode">;

/** Vertical flow: every node takes an incoming edge on top, outgoing at bottom. */
function FlowHandles() {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        className="!bg-border !border-border !h-1.5 !w-1.5"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        className="!bg-border !border-border !h-1.5 !w-1.5"
      />
    </>
  );
}

/**
 * Renders the label, plus the secondary line when there is one. Kept separate so
 * every shape lays its text out identically.
 */
function NodeLabel({
  label,
  sublabel,
  className,
  style,
}: {
  label: string;
  sublabel?: string;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={cn("min-w-0 px-2 text-center", className)} style={style}>
      <div className="truncate text-xs font-medium">{label}</div>
      {isPopulatedString(sublabel) && (
        <div className="truncate text-[10px] opacity-70">{sublabel}</div>
      )}
    </div>
  );
}

/**
 * Wraps a node's body so a node that points somewhere navigates, while a node
 * that expands or creates handles the click instead. Clicks never bubble to the
 * canvas, which would clear the current selection.
 */
function NodeAction({
  data,
  children,
  className,
}: {
  data: DiagramNodeData;
  children: ReactNode;
  className?: string;
}) {
  const { selection, create, href, onSelect, onCreate } = data;

  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    if (create) return onCreate(create);
    if (selection) return onSelect(selection);
  }

  const interactive = Boolean(create || selection);

  // A node can both expand and link (a pipeline does): expanding wins on click,
  // and the link stays reachable through the title.
  if (!interactive && isPopulatedString(href)) {
    return (
      <Link
        href={href}
        prefetch={false}
        className={cn("block h-full w-full", className)}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center",
        interactive && "cursor-pointer",
        className
      )}
      onClick={interactive ? handleClick : undefined}
      role={interactive ? "button" : undefined}
    >
      {children}
    </div>
  );
}

/** One chip of a factory node's rail: a collection to expand, or its create. */
function ChipButton({
  chip,
  tone,
  isSelected,
  onSelect,
  onCreate,
}: {
  chip: FactoryChip;
  tone: number;
  isSelected: boolean;
  onSelect: DiagramNodeData["onSelect"];
  onCreate: DiagramNodeData["onCreate"];
}) {
  const styles = getToneStyles(tone);

  return (
    <button
      type="button"
      className={cn(
        "flex h-7 w-full items-center justify-between gap-1 rounded border px-2 text-[10px] transition-colors",
        chip.create
          ? "border-border text-muted-foreground border-dashed hover:border-solid"
          : cn(styles.solid, "hover:brightness-95"),
        isSelected && "ring-primary ring-2 ring-offset-1"
      )}
      onClick={(event) => {
        event.stopPropagation();
        if (chip.create) return onCreate(chip.create);
        if (chip.selection) return onSelect(chip.selection);
      }}
    >
      <span className="truncate">{chip.label}</span>
      {chip.count !== undefined && (
        <span className="shrink-0 opacity-70">{chip.count}</span>
      )}
    </button>
  );
}

function FactoryNodeBody({ data }: { data: DiagramNodeData }) {
  const styles = getToneStyles(data.tone);

  return (
    <div className="flex h-full w-full gap-2">
      <NodeAction
        data={{ ...data, selection: undefined, create: undefined }}
        className={cn(
          "flex flex-1 items-center justify-center rounded-md border-2",
          styles.solid
        )}
      >
        <NodeLabel label={data.label} sublabel={data.sublabel} />
      </NodeAction>

      {data.chips && (
        <div className="flex w-[150px] shrink-0 flex-col justify-center gap-1">
          {data.chips.map((chip) => (
            <ChipButton
              key={chip.id}
              chip={chip}
              tone={data.tone}
              isSelected={isSameSelection(
                chip.selection,
                data.currentSelection
              )}
              onSelect={data.onSelect}
              onCreate={data.onCreate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * A diamond. The rotated square is its own layer so the label can sit upright
 * on top of it; the label is capped to the shape's inscribed width so it reads
 * as being inside the diamond rather than spilling over the edges.
 */
function DecisionNodeBody({ data }: { data: DiagramNodeData }) {
  const styles = getToneStyles(data.tone);
  const isPlaceholder = Boolean(data.create);

  return (
    <div className="relative h-full w-full">
      <div
        className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2",
          isPlaceholder
            ? "border-border border-dashed bg-transparent"
            : styles.solid
        )}
        style={{ width: DIAMOND_SIDE, height: DIAMOND_SIDE }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <NodeLabel
          label={data.label}
          sublabel={data.sublabel}
          style={{ maxWidth: DIAMOND_LABEL_WIDTH }}
          className={cn(
            isPlaceholder ? "text-muted-foreground" : styles.outline
          )}
        />
      </div>
    </div>
  );
}

function EntityNodeBody({ data }: { data: DiagramNodeData }) {
  const styles = getToneStyles(data.tone);

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-md border-2",
        styles.solid,
        data.isSelected && "ring-primary ring-2 ring-offset-2"
      )}
    >
      <NodeLabel label={data.label} sublabel={data.sublabel} />
    </div>
  );
}

function OutcomeNodeBody({ data }: { data: DiagramNodeData }) {
  const styles = getToneStyles(data.tone);

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-md border bg-transparent",
        styles.outline
      )}
    >
      <NodeLabel label={data.label} sublabel={data.sublabel} />
    </div>
  );
}

function PlaceholderNodeBody({ data }: { data: DiagramNodeData }) {
  return (
    <div className="border-border text-muted-foreground hover:border-primary hover:text-primary flex h-full w-full items-center justify-center rounded-md border border-dashed transition-colors">
      <NodeLabel label={data.label} sublabel={data.sublabel} />
    </div>
  );
}

export function DiagramFlowNodeComponent({ data }: NodeProps<DiagramFlowNode>) {
  const body =
    data.kind === "factory" ? (
      <FactoryNodeBody data={data} />
    ) : data.kind === "decision" ? (
      <DecisionNodeBody data={data} />
    ) : data.kind === "outcome" ? (
      <OutcomeNodeBody data={data} />
    ) : data.kind === "placeholder" ? (
      <PlaceholderNodeBody data={data} />
    ) : (
      <EntityNodeBody data={data} />
    );

  return (
    <div style={{ width: data.width, height: data.height }}>
      <FlowHandles />
      {/* The factory node wires its own actions per sub-element (title + chips). */}
      {data.kind === "factory" ? (
        body
      ) : (
        <NodeAction data={data}>{body}</NodeAction>
      )}
    </div>
  );
}

export const diagramNodeTypes = {
  diagramNode: DiagramFlowNodeComponent,
};
