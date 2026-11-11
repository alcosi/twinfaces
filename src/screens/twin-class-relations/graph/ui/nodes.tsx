"use client";

import { type Node, type NodeProps } from "@xyflow/react";
import { Plus } from "lucide-react";
import { MouseEvent, ReactNode } from "react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { LinkResourceLink } from "@/features/link/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import {
  TWIN_CLASS_CARD_PRESETS,
  TwinClassCardIcon,
  twinClassCardSections,
} from "@/features/twin-class/ui";
import { TwinClassStatusResourceLink } from "@/features/twin-status/ui";
import { PlatformArea } from "@/shared/config";
import {
  DASHED_STROKE,
  DIAGRAM_STROKE,
  DashedOutline,
  SOLID_EDGE_WIDTH,
} from "@/shared/ui/diagram";
import {
  EntityCard,
  EntityCardChips,
  EntityCardHeader,
  EntityCardSection,
  EntityCardSectionRegistry,
  EntityCardSections,
} from "@/shared/ui/entity-card";

import {
  CARD,
  CaptionNode,
  CardSection,
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

export type ClassCardData = ClassCardNode & {
  mode: GraphMode;
  onToggleSection: (nodeId: string, section: CardSection) => void;
};
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

/**
 * A class node: the app's entity card, at the graph's fixed size. Advanced mode
 * adds the class's fields and statuses — sections only the graph supplies, on
 * top of the class's own registry, and folded by state the graph keeps: the
 * layout needs each card's height before anything renders.
 */
function ClassCard({ data }: NodeProps<Node<ClassCardData, "classCard">>) {
  const { twinClass, mode } = data;
  const href = data.isCenter ? undefined : classHref(twinClass);

  const registry: EntityCardSectionRegistry<TwinClass_DETAILED> = {
    ...twinClassCardSections,
    fields: (entity) => (
      <ChipSection
        label="Fields"
        items={entity.fields ?? []}
        expanded={Boolean(data.expansion.fields)}
        onToggle={() => data.onToggleSection(data.id, "fields")}
        renderItem={(field) => (
          <TwinClassFieldResourceLink
            data={field as TwinClassField_DETAILED}
            withTooltip
          />
        )}
      />
    ),
    statuses: (entity) => (
      <ChipSection
        label="Statuses"
        items={entity.statuses ?? []}
        expanded={Boolean(data.expansion.statuses)}
        onToggle={() => data.onToggleSection(data.id, "statuses")}
        renderItem={(status) => (
          <TwinClassStatusResourceLink data={status} withTooltip />
        )}
      />
    ),
  };

  return (
    <EntityCard
      interactive={Boolean(href)}
      style={{ width: data.width, height: data.height }}
    >
      <EntityCardHeader
        title={getClassTitle(twinClass)}
        subtitle={getClassSubtitle(twinClass)}
        subtitleLines={mode === "advanced" ? CARD.descriptionLines : 1}
        icon={<TwinClassCardIcon twinClass={twinClass} />}
        href={href}
      />

      {mode === "advanced" && (
        <EntityCardSections
          entity={twinClass}
          registry={registry}
          preset={TWIN_CLASS_CARD_PRESETS.graph}
        />
      )}
    </EntityCard>
  );
}

function ChipSection<T extends { id?: string }>({
  label,
  items,
  ...chips
}: {
  label: string;
  items: T[];
  expanded: boolean;
  onToggle: () => void;
  renderItem: (item: T) => ReactNode;
}) {
  if (items.length === 0) return null;

  return (
    <EntityCardSection label={label} count={items.length}>
      <EntityCardChips
        items={items}
        getKey={(item, index) => item.id ?? `${index}`}
        {...chips}
      />
    </EntityCardSection>
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
          d={toPath(wire, data.originX, data.originY)}
          fill="none"
          stroke={DIAGRAM_STROKE}
          strokeWidth={wire.dashed ? DASHED_STROKE.width : SOLID_EDGE_WIDTH}
          strokeDasharray={wire.dashed ? DASHED_STROKE.dashArray : undefined}
        />
      ))}
    </svg>
  );
}

/** Radius of the rounded corners at the far ends of a trunk. */
const CORNER_RADIUS = 10;

/**
 * The wire as an SVG path, relative to the layer's origin. A corner marked
 * rounded is cut short on both sides and joined by a quadratic curve — never by
 * more than the shorter of its two runs, so a corner on a short run still
 * meets the card it leads to.
 */
function toPath(wire: Wire, originX: number, originY: number): string {
  const points = wire.points.map(
    ([x, y]) => [x - originX, y - originY] as const
  );
  const rounded = new Set(wire.rounded ?? []);

  return points
    .map(([x, y], index) => {
      if (index === 0) return `M ${x} ${y}`;

      const previous = points[index - 1];
      const next = points[index + 1];
      if (!rounded.has(index) || !previous || !next) return `L ${x} ${y}`;

      const [px, py] = previous;
      const [nx, ny] = next;
      const lengthIn = Math.hypot(x - px, y - py);
      const lengthOut = Math.hypot(nx - x, ny - y);
      const radius = Math.min(CORNER_RADIUS, lengthIn, lengthOut);
      // A corner with no run on one side is no corner at all.
      if (radius < 1) return `L ${x} ${y}`;

      const startX = x - ((x - px) / lengthIn) * radius;
      const startY = y - ((y - py) / lengthIn) * radius;
      const endX = x + ((nx - x) / lengthOut) * radius;
      const endY = y + ((ny - y) / lengthOut) * radius;

      return `L ${startX} ${startY} Q ${x} ${y} ${endX} ${endY}`;
    })
    .join(" ");
}

export const classNodeTypes = {
  classCard: ClassCard,
  placeholder: PlaceholderCard,
  caption: Caption,
  linkPill: LinkPill,
  wires: Wires,
};
