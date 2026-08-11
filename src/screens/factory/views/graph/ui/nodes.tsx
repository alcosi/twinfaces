"use client";

import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import Link from "next/link";
import {
  CSSProperties,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { cn, isPopulatedArray, isPopulatedString } from "@/shared/libs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

import {
  DASHED_STROKE,
  DIAMOND_BOX,
  DIAMOND_LABEL_WIDTH,
  DIAMOND_SIDE,
  DiagramNode,
  FACTORY_CARD_CENTER_X,
  FACTORY_NODE,
  FactoryChip,
  FactoryCreateTarget,
  FactoryGraphSelection,
  NODE_ACTIVE_RING,
  NODE_INTERACTIVE_HOVER,
  NODE_SHADOW,
  getChipStackHeight,
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

/**
 * Vertical flow: every node takes an incoming edge on top, outgoing at bottom.
 *
 * `centerX` overrides the default 50%-of-the-node placement. A factory node is
 * wider than its card — the chip rail sits to the right — so without it the
 * edges would leave from somewhere off the card's right edge instead of from
 * under its centre.
 */
function FlowHandles({ centerX }: { centerX?: number }) {
  const style =
    centerX === undefined
      ? undefined
      : { left: centerX, transform: "translateX(-50%)" };

  return (
    <>
      {/* Kept invisible, as in the twin class Graph tab: the handles only exist
          to anchor the edges, and visible dots just speckle the diagram. */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        style={style}
        className="!opacity-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        style={style}
        className="!opacity-0"
      />
    </>
  );
}

/**
 * The dashed outline of a create affordance, drawn as SVG so it carries the exact
 * same dash pattern as the edge arriving at it — `border-dashed` would leave the
 * browser to pick its own pattern.
 *
 * Takes its colour from `currentColor`, so hover states come from the parent.
 */
function DashedOutline({
  width,
  height,
  shape = "rect",
  radius = 8,
  className,
}: {
  width: number;
  height: number;
  shape?: "rect" | "diamond";
  radius?: number;
  className?: string;
}) {
  // A stroke straddles its path, so inset by half of it or the outer edge clips.
  const inset = DASHED_STROKE.width / 2;
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: DASHED_STROKE.width,
    strokeDasharray: DASHED_STROKE.dashArray,
  };

  return (
    <svg
      width={width}
      height={height}
      // Positioning is left to the caller: a rect fills the node, a diamond is
      // centred in it, and merging conflicting inset utilities here is brittle.
      className={cn("pointer-events-none", className)}
      aria-hidden
    >
      {shape === "diamond" ? (
        <polygon
          points={[
            `${width / 2},${inset}`,
            `${width - inset},${height / 2}`,
            `${width / 2},${height - inset}`,
            `${inset},${height / 2}`,
          ].join(" ")}
          {...stroke}
        />
      ) : (
        <rect
          x={inset}
          y={inset}
          width={width - DASHED_STROKE.width}
          height={height - DASHED_STROKE.width}
          rx={radius}
          {...stroke}
        />
      )}
    </svg>
  );
}

/**
 * Whether clicking the node does anything: expand it in the Node view, open the
 * create sheet, or navigate to the entity's page. Drives the hover affordance —
 * an inert node (an `input class` diamond, a condition gate, an outcome box)
 * must not pretend to be clickable.
 */
function isInteractive(data: DiagramNodeData): boolean {
  return Boolean(data.selection || data.create || isPopulatedString(data.href));
}

/**
 * Text that ellipsises, and reveals itself in a tooltip — but only when it is
 * actually clipped. Nodes are fixed-width, so long factory and pipeline names
 * are routinely cut off and unreadable; a tooltip on every node regardless would
 * pop up over text that is already whole.
 */
function TruncatedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClipped, setIsClipped] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Layout widths, so the canvas zoom — a CSS transform — cannot skew them.
    const measure = () =>
      setIsClipped(element.scrollWidth > element.clientWidth + 1);

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [text]);

  return (
    // The trigger stays mounted whether or not the text is clipped: re-parenting
    // it would hand the effect a stale node and leave the observer detached.
    <Tooltip>
      <TooltipTrigger asChild>
        <div ref={ref} className={cn("truncate", className)}>
          {text}
        </div>
      </TooltipTrigger>
      {isClipped && (
        <TooltipContent className="max-w-xs break-words">{text}</TooltipContent>
      )}
    </Tooltip>
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
      <TruncatedText text={label} className="text-xs font-medium" />
      {isPopulatedString(sublabel) && (
        <TruncatedText text={sublabel} className="text-[10px] opacity-70" />
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
  style,
}: {
  data: DiagramNodeData;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
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
        style={style}
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
      style={style}
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
      style={{ height: FACTORY_NODE.chipHeight }}
      className={cn(
        "group/chip relative flex w-full items-center justify-between gap-1 rounded-md px-2 text-[10px] transition-all",
        chip.create
          ? "text-muted-foreground hover:text-brand-600"
          : cn(
              styles.solid,
              "border shadow-sm hover:shadow hover:brightness-95"
            ),
        isSelected && cn(NODE_ACTIVE_RING, "ring-offset-1")
      )}
      onClick={(event) => {
        event.stopPropagation();
        if (chip.create) return onCreate(chip.create);
        if (chip.selection) return onSelect(chip.selection);
      }}
    >
      {chip.create && (
        <DashedOutline
          width={FACTORY_NODE.railWidth}
          height={FACTORY_NODE.chipHeight}
          radius={6}
          className="group-hover/chip:text-brand-500 absolute inset-0 text-[var(--diagram-stroke)] transition-colors"
        />
      )}
      <TruncatedText text={chip.label} className="relative min-w-0" />
      {chip.count !== undefined && (
        <span className="relative shrink-0 opacity-70">{chip.count}</span>
      )}
    </button>
  );
}

/**
 * The connector joining a factory card to its chip rail — the "spider" of the
 * reference diagram: a stub off the card, then one smoothly bent branch per
 * chip. Drawn as SVG rather than borders so the bends can be rounded and so it
 * adapts to however many chips the rail happens to hold.
 */
function ChipSpider({
  chipCount,
  height,
}: {
  chipCount: number;
  height: number;
}) {
  const { connectorWidth, chipHeight, chipGap, spiderRadius } = FACTORY_NODE;

  // Mirrors the rail's `justify-center` stacking, so the branches meet the chips.
  const stackTop = (height - getChipStackHeight(chipCount)) / 2;
  const branchYs = Array.from(
    { length: chipCount },
    (_, index) => stackTop + index * (chipHeight + chipGap) + chipHeight / 2
  );

  const trunkX = connectorWidth / 2;
  const midY = height / 2;

  /**
   * One branch: out of the trunk, round the elbow, into the chip. Drawn as a
   * path per chip rather than a straight trunk plus stubs, so each corner can
   * carry its own arc — a shared straight trunk cannot be rounded.
   */
  function buildBranch(y: number): string {
    const distance = Math.abs(y - midY);

    // Level with the stub: no elbow to round, just run straight across.
    if (distance < 1) return `M${trunkX} ${y} H ${connectorWidth}`;

    // A short branch cannot fit the full radius without overshooting the trunk.
    const radius = Math.min(spiderRadius, distance);
    // Where the arc starts: back off along the trunk, towards the stub.
    const arcStartY = y > midY ? y - radius : y + radius;

    return [
      `M${trunkX} ${midY}`,
      `V ${arcStartY}`,
      `Q ${trunkX} ${y} ${trunkX + radius} ${y}`,
      `H ${connectorWidth}`,
    ].join(" ");
  }

  return (
    <svg
      width={connectorWidth}
      height={height}
      className="text-border shrink-0"
      aria-hidden
    >
      <g
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      >
        {/* Stub from the card into the trunk */}
        <path d={`M0 ${midY} H ${trunkX}`} />
        {branchYs.map((y) => (
          <path key={y} d={buildBranch(y)} />
        ))}
      </g>
    </svg>
  );
}

function FactoryNodeBody({ data }: { data: DiagramNodeData }) {
  const styles = getToneStyles(data.tone);
  const chips = data.chips ?? [];
  const hasChips = isPopulatedArray(chips);

  return (
    <div className="flex h-full w-full">
      <NodeAction
        data={{ ...data, selection: undefined, create: undefined }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl border-2 transition-all",
          styles.solid,
          NODE_SHADOW,
          // The card navigates to the factory's page; the chips beside it have
          // their own affordances.
          isPopulatedString(data.href) && NODE_INTERACTIVE_HOVER
        )}
        // With a chip rail the card takes its own column; without one (the entry
        // and exit factories of a node view) it fills the node.
        style={hasChips ? { width: FACTORY_NODE.cardWidth } : undefined}
      >
        <NodeLabel label={data.label} sublabel={data.sublabel} />
      </NodeAction>

      {hasChips && (
        <>
          <ChipSpider chipCount={chips.length} height={data.height} />

          <div
            className="flex shrink-0 flex-col justify-center"
            style={{ width: FACTORY_NODE.railWidth, gap: FACTORY_NODE.chipGap }}
          >
            {chips.map((chip) => (
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
        </>
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
  // A plain `input class` or condition gate is inert; only the ones that expand
  // or link get hover feedback.
  const interactive = isInteractive(data);

  return (
    <div className="group/diamond relative h-full w-full">
      {isPlaceholder ? (
        // Drawn as a polygon rather than a rotated, dashed-bordered square: only
        // SVG can carry the diagram's shared dash pattern.
        <DashedOutline
          width={DIAMOND_BOX}
          height={DIAMOND_BOX}
          shape="diamond"
          className="group-hover/diamond:text-brand-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--diagram-stroke)] transition-colors"
        />
      ) : (
        <div
          className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 transition-all",
            styles.solid,
            NODE_SHADOW,
            interactive &&
              "group-hover/diamond:shadow-[0_12px_26px_-12px_rgba(15,23,42,0.45)] group-hover/diamond:brightness-[0.97]",
            // The shape is rotated, so a ring would be diamond-shaped too — that
            // reads as a second outline. A halo shadow stays square-on.
            data.isSelected && "ring-ring/70 ring-2"
          )}
          style={{ width: DIAMOND_SIDE, height: DIAMOND_SIDE }}
        />
      )}
      {/* Takes pointer events so the label's tooltip can be hovered — a click
          still reaches the node's handler, which is an ancestor. */}
      <div className="absolute inset-0 flex items-center justify-center">
        <NodeLabel
          label={data.label}
          sublabel={data.sublabel}
          style={{ maxWidth: DIAMOND_LABEL_WIDTH }}
          className={cn(
            isPlaceholder
              ? "text-muted-foreground group-hover/diamond:text-brand-600"
              : styles.outline
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
        "flex h-full w-full items-center justify-center rounded-xl border-2 transition-all",
        styles.solid,
        NODE_SHADOW,
        isInteractive(data) && NODE_INTERACTIVE_HOVER,
        data.isSelected && NODE_ACTIVE_RING
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
        "bg-background/60 flex h-full w-full items-center justify-center rounded-lg border shadow-sm",
        styles.outline
      )}
    >
      <NodeLabel label={data.label} sublabel={data.sublabel} />
    </div>
  );
}

function PlaceholderNodeBody({ data }: { data: DiagramNodeData }) {
  return (
    // Stays deliberately quiet — a create affordance should not compete with the
    // real nodes — and picks up the brand accent only on hover.
    <div className="group/placeholder hover:bg-brand-50/60 relative flex h-full w-full items-center justify-center rounded-lg transition-colors">
      <DashedOutline
        width={data.width}
        height={data.height}
        radius={8}
        className="group-hover/placeholder:text-brand-500 absolute inset-0 text-[var(--diagram-stroke)] transition-colors"
      />
      <NodeLabel
        label={data.label}
        sublabel={data.sublabel}
        className="text-muted-foreground group-hover/placeholder:text-brand-600 relative transition-colors"
      />
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

  const isFactory = data.kind === "factory";
  // A factory with a chip rail attaches its edges under the card, not under the
  // whole node — the rail extends the node right and would drag them off-centre.
  const centerX =
    isFactory && isPopulatedArray(data.chips)
      ? FACTORY_CARD_CENTER_X
      : undefined;

  return (
    <div style={{ width: data.width, height: data.height }}>
      <FlowHandles centerX={centerX} />
      {/* The factory node wires its own actions per sub-element (title + chips). */}
      {isFactory ? body : <NodeAction data={data}>{body}</NodeAction>}
    </div>
  );
}

export const diagramNodeTypes = {
  diagramNode: DiagramFlowNodeComponent,
};
