"use client";

import { type Node, type NodeProps } from "@xyflow/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { MouseEvent, ReactNode } from "react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { LinkResourceLink } from "@/features/link/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassIcon } from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { PlatformArea } from "@/shared/config";
import { cn, isPopulatedString } from "@/shared/libs";
import {
  DASHED_STROKE,
  DIAGRAM_STROKE,
  DashedOutline,
  NODE_INTERACTIVE_HOVER,
  NODE_SHADOW,
  SOLID_EDGE_WIDTH,
  TruncatedText,
} from "@/shared/ui/diagram";

import {
  CARD,
  CaptionNode,
  ClassCardNode,
  GraphMode,
  LINK_PILL_MAX_WIDTH,
  LinkPillNode,
  LinkSide,
  PlaceholderNode,
  Wire,
  getClassSubtitle,
  getClassTitle,
} from "../model";

export type ClassCardData = ClassCardNode & { mode: GraphMode };
export type PlaceholderData = PlaceholderNode & {
  onCreate: (side: LinkSide) => void;
};
export type WiresData = {
  wires: Wire[];
  /** Canvas coordinates of the layer's top-left corner. */
  originX: number;
  originY: number;
  width: number;
  height: number;
};

export type ClassFlowNode =
  | Node<ClassCardData, "classCard">
  | Node<PlaceholderData, "placeholder">
  | Node<CaptionNode, "caption">
  | Node<LinkPillNode, "linkPill">
  | Node<WiresData, "wires">;

function classHref(twinClass: TwinClass_DETAILED) {
  return `/${PlatformArea.core}/twinclass/${twinClass.id}`;
}

/** The tinted square holding the class icon. */
function ClassIcon() {
  return (
    <span
      className="bg-brand-500/10 text-brand-600 dark:text-brand-400 flex shrink-0 items-center justify-center rounded-md"
      style={{ width: CARD.iconSize, height: CARD.iconSize }}
    >
      <TwinClassIcon className="h-3.5 w-3.5" />
    </span>
  );
}

/**
 * The link on a card's header.
 *
 * Only the header, never the whole card: an advanced card's blocks are lists of
 * links themselves, and an anchor cannot contain another one.
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

/**
 * One block of an advanced card: a caption with the count, the first few chips,
 * and a "+N more" row leading to the tab that lists them all.
 */
function SectionView<T extends { id?: string }>({
  label,
  items,
  moreHref,
  renderItem,
}: {
  label: string;
  items: T[];
  moreHref: string;
  renderItem: (item: T) => ReactNode;
}) {
  if (items.length === 0) return null;

  const hidden = items.length - CARD.chipLimit;

  return (
    <div className="border-border border-t" style={{ padding: CARD.padding }}>
      <div
        className="text-muted-foreground flex items-center gap-1.5 text-[10px]"
        style={{ height: CARD.sectionLabelHeight }}
      >
        {label}
        <span className="bg-muted rounded-full px-1.5 text-[10px] leading-4 font-medium">
          {items.length}
        </span>
      </div>
      <div
        className="flex flex-col"
        style={{ gap: CARD.chipGap, marginTop: CARD.sectionGap }}
      >
        {items.slice(0, CARD.chipLimit).map((item, index) => (
          <div
            key={item.id ?? index}
            className="flex min-w-0"
            style={{ height: CARD.chipHeight }}
          >
            {renderItem(item)}
          </div>
        ))}
        {hidden > 0 && (
          <Link
            href={moreHref}
            prefetch={false}
            onClick={(event) => event.stopPropagation()}
            className="text-muted-foreground hover:text-foreground flex items-center text-[11px] transition-colors"
            style={{ height: CARD.chipHeight }}
          >
            +{hidden} more
          </Link>
        )}
      </div>
    </div>
  );
}

function ClassCard({ data }: NodeProps<Node<ClassCardData, "classCard">>) {
  const { twinClass, mode } = data;
  const href = data.isCenter ? undefined : classHref(twinClass);
  const subtitle = getClassSubtitle(twinClass);

  return (
    <div
      className={cn(
        "bg-card border-border flex flex-col overflow-hidden rounded-xl border text-left transition-colors",
        NODE_SHADOW,
        href && NODE_INTERACTIVE_HOVER
      )}
      style={{ width: data.width, height: data.height }}
    >
      <HeaderLink href={href}>
        <ClassIcon />

        <div className="min-w-0 flex-1">
          <TruncatedText
            text={getClassTitle(twinClass)}
            className="text-foreground text-xs leading-[18px] font-semibold"
          />

          {subtitle &&
            (mode === "advanced" ? (
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
      </HeaderLink>

      {mode === "advanced" && (
        <>
          <SectionView
            label="Fields"
            items={twinClass.fields ?? []}
            moreHref={`${classHref(twinClass)}#fields`}
            renderItem={(field) => (
              <TwinClassFieldResourceLink
                data={field as TwinClassField_DETAILED}
                withTooltip
              />
            )}
          />
          <SectionView
            label="Statuses"
            items={twinClass.statuses ?? []}
            moreHref={`${classHref(twinClass)}#statuses`}
            renderItem={(status) => (
              <TwinClassStatusResourceLink data={status} withTooltip />
            )}
          />
        </>
      )}
    </div>
  );
}

function PlaceholderCard({
  data,
}: NodeProps<Node<PlaceholderData, "placeholder">>) {
  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    data.onCreate(data.side);
  }

  // Stays deliberately quiet — a create affordance should not compete with the
  // real cards — so only the plus carries the colour at full strength.
  return (
    <button
      type="button"
      onClick={handleClick}
      className="group/placeholder hover:bg-muted/40 text-brand-600 dark:text-brand-400 relative flex items-center justify-center gap-1.5 rounded-lg transition-colors"
      style={{ width: data.width, height: data.height }}
    >
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
    </button>
  );
}

/**
 * Captions and link chips are positioned by their centre, since their width is
 * their content's. The background cuts the line they sit on.
 */
function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background -translate-x-1/2 -translate-y-1/2 rounded-lg">
      {children}
    </div>
  );
}

function Caption({ data }: NodeProps<Node<CaptionNode, "caption">>) {
  return (
    <Centered>
      <div className="text-foreground px-1.5 text-xs leading-6 font-semibold whitespace-nowrap">
        {data.text}
      </div>
    </Centered>
  );
}

function LinkPill({ data }: NodeProps<Node<LinkPillNode, "linkPill">>) {
  return (
    <Centered>
      <div className="flex" style={{ maxWidth: LINK_PILL_MAX_WIDTH }}>
        <LinkResourceLink data={data.link} withTooltip />
      </div>
    </Centered>
  );
}

/**
 * Every connector of the canvas in one SVG, drawn under the cards. The lines
 * are straight orthogonal runs between known points, so there is nothing for
 * React Flow's edge routing to add — and a single layer needs no handles on the
 * cards at all.
 */
function Wires({ data }: NodeProps<Node<WiresData, "wires">>) {
  const toPath = (wire: Wire) =>
    wire.points
      .map(
        ([x, y], index) =>
          `${index === 0 ? "M" : "L"} ${x - data.originX} ${y - data.originY}`
      )
      .join(" ");

  // Dashed first: where a dashed wire shares a run with a solid one, the solid
  // one wins.
  const ordered = [...data.wires].sort(
    (a, b) => Number(Boolean(b.dashed)) - Number(Boolean(a.dashed))
  );

  return (
    <svg
      width={data.width}
      height={data.height}
      className="pointer-events-none overflow-visible"
      aria-hidden
    >
      {ordered.map((wire) => (
        <path
          key={wire.id}
          d={toPath(wire)}
          fill="none"
          stroke={DIAGRAM_STROKE}
          strokeWidth={wire.dashed ? DASHED_STROKE.width : SOLID_EDGE_WIDTH}
          strokeDasharray={wire.dashed ? DASHED_STROKE.dashArray : undefined}
        />
      ))}
    </svg>
  );
}

export const classNodeTypes = {
  classCard: ClassCard,
  placeholder: PlaceholderCard,
  caption: Caption,
  linkPill: LinkPill,
  wires: Wires,
};
