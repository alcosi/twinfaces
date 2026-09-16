"use client";

import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { MouseEvent, ReactNode, useEffect, useRef, useState } from "react";

import { cn, isPopulatedString } from "@/shared/libs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

import {
  CARD,
  DASHED_STROKE,
  DiagramGroup,
  DiagramNode,
  FactoryCreateTarget,
  GraphChip,
  GraphMode,
  GraphSection,
  NODE_INTERACTIVE_HOVER,
  NODE_SHADOW,
  getNodeKindStyle,
  getNodeSubtitle,
} from "../model";

export type DiagramNodeData = DiagramNode & {
  mode: GraphMode;
  onCreate: (target: FactoryCreateTarget) => void;
};

export type DiagramGroupData = DiagramGroup & {
  width: number;
  height: number;
};

export type DiagramFlowNode =
  | Node<DiagramNodeData, "diagramNode">
  | Node<DiagramGroupData, "diagramGroup">;

/**
 * Vertical flow: every node takes an incoming edge on top, outgoing at bottom.
 * The handles stay invisible — they only exist to anchor the edges, and visible
 * dots just speckle the diagram.
 */
function FlowHandles() {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={false}
        className="!opacity-0"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={false}
        className="!opacity-0"
      />
    </>
  );
}

/**
 * The dashed outline of a create affordance and of a group box, drawn as SVG so
 * it carries the exact same dash pattern as the edge arriving at it —
 * `border-dashed` would leave the browser to pick its own pattern.
 *
 * Takes its colour from `currentColor`, so hover states come from the parent.
 */
function DashedOutline({
  width,
  height,
  radius = 8,
  opacity,
  className,
}: {
  width: number;
  height: number;
  radius?: number;
  opacity?: number;
  className?: string;
}) {
  // A stroke straddles its path, so inset by half of it or the outer edge clips.
  const inset = DASHED_STROKE.width / 2;

  return (
    <svg
      width={width}
      height={height}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      <rect
        x={inset}
        y={inset}
        width={width - DASHED_STROKE.width}
        height={height - DASHED_STROKE.width}
        rx={radius}
        fill="none"
        stroke="currentColor"
        strokeOpacity={opacity}
        strokeWidth={DASHED_STROKE.width}
        strokeDasharray={DASHED_STROKE.dashArray}
      />
    </svg>
  );
}

/**
 * Text that ellipsises, and reveals itself in a tooltip — but only when it is
 * actually clipped. Cards are fixed-width, so long factory and pipeline names
 * are routinely cut off and unreadable; a tooltip on every one regardless would
 * pop up over text that is already whole.
 */
function TruncatedText({
  text,
  className,
  lines = 1,
}: {
  text: string;
  className?: string;
  lines?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isClipped, setIsClipped] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Layout sizes, so the canvas zoom — a CSS transform — cannot skew them.
    const measure = () =>
      setIsClipped(
        element.scrollWidth > element.clientWidth + 1 ||
          element.scrollHeight > element.clientHeight + 1
      );

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
        <div
          ref={ref}
          className={cn(
            lines === 1 ? "truncate" : "overflow-hidden",
            className
          )}
          style={
            lines > 1
              ? {
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: lines,
                }
              : undefined
          }
        >
          {text}
        </div>
      </TooltipTrigger>
      {isClipped && (
        <TooltipContent className="max-w-xs break-words">{text}</TooltipContent>
      )}
    </Tooltip>
  );
}

/** The tinted square holding a node's icon — the design's Variant C placement. */
function NodeIcon({ kind }: { kind: DiagramNode["kind"] }) {
  if (kind === "placeholder") return null;

  const { Icon, tint, accent } = getNodeKindStyle(kind);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md",
        tint,
        accent
      )}
      style={{ width: CARD.iconSize, height: CARD.iconSize }}
    >
      <Icon className="h-3.5 w-3.5" />
    </span>
  );
}

/** One related entity inside a card — styled as the app's resource links are. */
function ChipView({ chip }: { chip: GraphChip }) {
  const { Icon } = getNodeKindStyle(chip.kind);

  const body = (
    <>
      <Icon className="h-3 w-3 shrink-0" />
      <TruncatedText text={chip.label} className="min-w-0" />
    </>
  );

  const className = cn(
    "border-border flex w-full items-center gap-1.5 rounded-lg border px-2 text-[11px] transition-colors",
    chip.inactive
      ? "text-link-disabled border-link-disabled/50"
      : "text-link-enabled hover:border-link-enabled"
  );

  return (
    <div style={{ height: CARD.chipHeight }}>
      {isPopulatedString(chip.href) ? (
        <Link
          href={chip.href}
          prefetch={false}
          className={cn(className, "h-full")}
          onClick={(event) => event.stopPropagation()}
        >
          {body}
        </Link>
      ) : (
        <div className={cn(className, "h-full")}>{body}</div>
      )}
    </div>
  );
}

/** One block of an advanced card: a caption and the chips under it. */
function SectionView({ section }: { section: GraphSection }) {
  return (
    <div className="border-border border-t" style={{ padding: CARD.padding }}>
      <div
        className={cn(
          "text-muted-foreground",
          section.variant === "handover"
            ? "text-[9px] font-semibold tracking-wider uppercase"
            : "text-[10px]"
        )}
        style={{ height: CARD.sectionLabelHeight }}
      >
        {section.label}
      </div>
      <div
        className="flex flex-col"
        style={{ gap: CARD.chipGap, marginTop: CARD.sectionGap }}
      >
        {section.chips.map((chip) => (
          <ChipView key={chip.id} chip={chip} />
        ))}
      </div>
    </div>
  );
}

/**
 * The link on a card's header.
 *
 * Only the header, never the whole card: an advanced card's blocks are lists of
 * links themselves, and an anchor cannot contain another one — React says so out
 * loud, and the nesting breaks hydration.
 */
function HeaderLink({
  href,
  children,
}: {
  href: string | undefined;
  children: ReactNode;
}) {
  const className = "flex items-start gap-2";

  if (!isPopulatedString(href)) {
    return (
      <div className={className} style={{ padding: CARD.padding }}>
        {children}
      </div>
    );
  }

  return (
    <Link
      href={href}
      prefetch={false}
      className={className}
      style={{ padding: CARD.padding }}
      onClick={(event) => event.stopPropagation()}
    >
      {children}
    </Link>
  );
}

function NodeCard({ data }: { data: DiagramNodeData }) {
  const subtitle = getNodeSubtitle(data, data.mode);

  return (
    <div
      className={cn(
        "bg-card border-border flex h-full w-full flex-col overflow-hidden rounded-xl border text-left transition-colors",
        NODE_SHADOW,
        isPopulatedString(data.href) && NODE_INTERACTIVE_HOVER,
        // Switched-off entities stay legible but visibly out of the flow.
        data.inactive && "opacity-55"
      )}
    >
      <HeaderLink href={data.href}>
        <NodeIcon kind={data.kind} />

        <div className="min-w-0 flex-1">
          <TruncatedText
            text={data.label}
            className="text-foreground text-xs leading-[18px] font-semibold"
          />

          {subtitle &&
            (data.mode === "advanced" ? (
              <TruncatedText
                text={subtitle}
                lines={CARD.descriptionLines}
                className="text-muted-foreground text-[10px] leading-[14px]"
              />
            ) : (
              <TruncatedText
                text={subtitle}
                className="text-muted-foreground text-[10px] leading-[15px]"
              />
            ))}
        </div>

        {data.inactive && (
          <span className="text-muted-foreground bg-muted shrink-0 rounded px-1 text-[9px] leading-4">
            off
          </span>
        )}
      </HeaderLink>

      {data.sections?.map((section) => (
        <SectionView key={section.id} section={section} />
      ))}
    </div>
  );
}

function PlaceholderCard({ data }: { data: DiagramNodeData }) {
  // Coloured after whatever it stands in for, so the row of affordances reads at
  // a glance: green adds a multiplier, teal a pipeline, violet a branch.
  const accent = data.accentKind
    ? getNodeKindStyle(data.accentKind).accent
    : undefined;

  // Stays deliberately quiet — a create affordance should not compete with the
  // real cards — so only the plus carries the colour at full strength.
  const className = cn(
    "group/placeholder hover:bg-muted/40 relative flex h-full w-full items-center justify-center gap-1.5 rounded-lg transition-colors",
    accent
  );

  const body = (
    <>
      <DashedOutline
        width={data.width}
        height={data.height}
        opacity={0.55}
        className="transition-opacity group-hover/placeholder:opacity-100"
      />
      <Plus className="relative h-3.5 w-3.5" />
      <span className="text-muted-foreground group-hover/placeholder:text-foreground relative text-[11px] transition-colors">
        {data.label}
      </span>
    </>
  );

  // Not everything a placeholder offers is a create: the next factory is a field
  // of the pipeline or branch, so that one links to the entity's own page.
  if (isPopulatedString(data.href)) {
    return (
      <Link
        href={data.href}
        prefetch={false}
        className={className}
        onClick={(event) => event.stopPropagation()}
      >
        {body}
      </Link>
    );
  }

  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    if (data.create) data.onCreate(data.create);
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {body}
    </button>
  );
}

/**
 * The dashed box around everything one factory owns. Inert by design: it sits
 * under the cards and must never swallow a click meant for one of them.
 */
function GroupBox({ data }: { data: DiagramGroupData }) {
  return (
    <div
      className="text-border pointer-events-none relative"
      style={{ width: data.width, height: data.height }}
    >
      <DashedOutline width={data.width} height={data.height} radius={12} />
      <span className="text-muted-foreground absolute top-2 left-3 text-[10px]">
        {data.label}
      </span>
    </div>
  );
}

export function DiagramFlowNodeComponent({
  data,
}: NodeProps<Node<DiagramNodeData, "diagramNode">>) {
  return (
    <div style={{ width: data.width, height: data.height }}>
      <FlowHandles />
      {data.kind === "placeholder" ? (
        <PlaceholderCard data={data} />
      ) : (
        <NodeCard data={data} />
      )}
    </div>
  );
}

export function DiagramFlowGroupComponent({
  data,
}: NodeProps<Node<DiagramGroupData, "diagramGroup">>) {
  return <GroupBox data={data} />;
}

export const diagramNodeTypes = {
  diagramNode: DiagramFlowNodeComponent,
  diagramGroup: DiagramFlowGroupComponent,
};
