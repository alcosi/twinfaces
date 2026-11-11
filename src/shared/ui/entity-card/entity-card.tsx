"use client";

import Link from "next/link";
import {
  CSSProperties,
  ElementType,
  Fragment,
  MouseEvent,
  ReactNode,
  createElement,
  isValidElement,
  useState,
} from "react";

import { cn, isElementType, isPopulatedString } from "@/shared/libs";
import { TruncatedText } from "@/shared/ui/diagram";

import { ENTITY_CARD } from "./constants";

/**
 * The one card of the app: a header — icon, title, subtitle, actions — over a
 * stack of sections divided by hairlines. The graphs draw their nodes with it,
 * the resource link tooltips are built from it, and the table card view lays
 * its rows out as it.
 *
 * Which sections a card carries is up to the place showing it; see
 * `EntityCardSections` for picking them from an entity's registry.
 */
export function EntityCard({
  children,
  className,
  style,
  interactive,
  inactive,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Lifts the border on hover — for a card that navigates somewhere. */
  interactive?: boolean;
  /** Switched-off entities stay legible but visibly out of the flow. */
  inactive?: boolean;
  onClick?: (event: MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border-border flex flex-col overflow-hidden rounded-xl border text-left text-xs shadow-[0_1px_2px_0_rgba(15,23,42,0.06)] transition-colors",
        interactive &&
          "hover:border-brand-400 cursor-pointer hover:shadow-[0_4px_12px_-4px_rgba(15,23,42,0.12)]",
        inactive && "opacity-55",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

/**
 * Icons arrive at all sizes — many were drawn for the old 64px tooltip circle.
 * The tile brings an icon down to its own scale, and lets an avatar or an image
 * fill it edge to edge.
 */
function IconTile({
  icon,
  className,
}: {
  icon: ReactNode | ElementType;
  className?: string;
}) {
  const content = isValidElement(icon)
    ? icon
    : isElementType(icon)
      ? createElement(icon, { className: "h-3.5 w-3.5" })
      : icon;

  return (
    <span
      className={cn(
        "bg-brand-500/10 text-brand-600 dark:text-brand-400 flex shrink-0 items-center justify-center overflow-hidden rounded-md",
        "[&>*:not(svg)]:size-full [&>*:not(svg)]:rounded-md [&>*:not(svg)]:border-0 [&>svg]:size-3.5",
        className
      )}
      style={{ width: ENTITY_CARD.iconSize, height: ENTITY_CARD.iconSize }}
    >
      {content}
    </span>
  );
}

export type EntityCardHeaderProps = {
  title: string;
  subtitle?: string;
  /** Lines the subtitle may take before it is clamped. */
  subtitleLines?: number;
  icon?: ReactNode | ElementType;
  /** Overrides the icon tile's tint — an element kind's own colour. */
  iconClassName?: string;
  /**
   * Turns the header — and only the header — into a link. Never the whole
   * card: its sections are lists of links themselves, and an anchor cannot
   * contain another one.
   */
  href?: string;
  /** A small mark after the title — "off", a count. */
  badge?: ReactNode;
  /** The entity's own menu, in the header's corner. */
  actions?: ReactNode;
};

export function EntityCardHeader({
  title,
  subtitle,
  subtitleLines = 1,
  icon,
  iconClassName,
  href,
  badge,
  actions,
}: EntityCardHeaderProps) {
  const body = (
    <>
      {icon && <IconTile icon={icon} className={iconClassName} />}

      {/* Centred against the icon tile, so a title with no subtitle sits level
          with it instead of hugging its top edge. Never taller than the tile
          or the text, so a graph's measured height still holds. */}
      <div
        className="flex min-w-0 flex-1 flex-col justify-center"
        style={{ minHeight: icon ? ENTITY_CARD.iconSize : undefined }}
      >
        <TruncatedText
          text={title}
          className="text-foreground text-xs leading-[18px] font-semibold"
        />
        {isPopulatedString(subtitle) && (
          <TruncatedText
            text={subtitle}
            lines={subtitleLines}
            className={cn(
              "text-muted-foreground text-[10px]",
              subtitleLines > 1 ? "leading-[14px]" : "leading-[15px]"
            )}
          />
        )}
      </div>
    </>
  );

  const className = "flex min-w-0 flex-1 items-start gap-2";

  return (
    <div
      className="flex items-start gap-2"
      style={{ padding: ENTITY_CARD.padding }}
    >
      {isPopulatedString(href) ? (
        <Link
          href={href}
          prefetch={false}
          className={className}
          onClick={(event) => event.stopPropagation()}
        >
          {body}
        </Link>
      ) : (
        <div className={className}>{body}</div>
      )}

      {badge && <span className="shrink-0">{badge}</span>}
      {actions && (
        <div
          className="-my-0.5 shrink-0"
          onClick={(event) => event.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </div>
  );
}

/**
 * One section of a card: a hairline above, an optional caption with a count,
 * and whatever the section holds.
 *
 * `empty:hidden` keeps a section whose every item was conditional from drawing
 * a divider over nothing.
 */
export function EntityCardSection({
  label,
  count,
  hint,
  labelClassName,
  className,
  children,
}: {
  label?: ReactNode;
  count?: number;
  /** Shown on hovering the caption — a parameter's type, say. */
  hint?: string;
  labelClassName?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("border-border border-t empty:hidden", className)}
      style={{ padding: ENTITY_CARD.padding }}
    >
      {label !== undefined && (
        <div
          className={cn(
            "text-muted-foreground flex min-w-0 items-center gap-1.5 text-[10px]",
            labelClassName
          )}
          style={{
            height: ENTITY_CARD.sectionLabelHeight,
            marginBottom: ENTITY_CARD.sectionGap,
          }}
          title={hint}
        >
          <span className="truncate">{label}</span>
          {count !== undefined && (
            <span className="bg-muted shrink-0 rounded-full px-1.5 text-[10px] leading-4 font-medium">
              {count}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

/**
 * A label and its value on one row — the shape every "key: value" of a tooltip
 * and every column of a table row takes inside a card.
 */
export function EntityCardField({
  label,
  children,
  labelWidth = 112,
}: {
  label: ReactNode;
  children: ReactNode;
  labelWidth?: number;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2 py-0.5">
      <div
        className="text-muted-foreground shrink-0 py-1 text-[11px] leading-4 break-words"
        style={{ width: labelWidth }}
      >
        {label}
      </div>
      <div className="text-foreground flex min-h-6 min-w-0 flex-1 flex-wrap items-center gap-1 text-xs break-words">
        {children}
      </div>
    </div>
  );
}

/** Fields stacked inside a section, with a little air between the rows. */
export function EntityCardFields({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-0.5">{children}</div>;
}

/**
 * A vertical list of chips — resource links, mostly — folding past
 * {@link ENTITY_CARD.chipLimit} into a "+N more" row.
 *
 * Folding is the list's own state unless `expanded` is passed: a graph has to
 * know a card's height before it renders, so it keeps the state itself.
 */
export function EntityCardChips<T>({
  items,
  renderItem,
  getKey,
  limit = ENTITY_CARD.chipLimit,
  expanded: controlledExpanded,
  onToggle,
}: {
  items: T[];
  renderItem: (item: T) => ReactNode;
  getKey?: (item: T, index: number) => string;
  limit?: number;
  expanded?: boolean;
  onToggle?: () => void;
}) {
  const [ownExpanded, setOwnExpanded] = useState(false);
  const expanded = controlledExpanded ?? ownExpanded;

  if (items.length === 0) return null;

  const foldable = items.length > limit;
  const visible = foldable && !expanded ? items.slice(0, limit) : items;

  function handleToggle(event: MouseEvent) {
    event.stopPropagation();
    if (onToggle) onToggle();
    else setOwnExpanded((current) => !current);
  }

  return (
    <div className="flex flex-col" style={{ gap: ENTITY_CARD.chipGap }}>
      {visible.map((item, index) => (
        <Fragment key={getKey?.(item, index) ?? index}>
          <div
            className="flex min-w-0"
            style={{ height: ENTITY_CARD.chipHeight }}
          >
            {renderItem(item)}
          </div>
        </Fragment>
      ))}
      {foldable && (
        <button
          type="button"
          onClick={handleToggle}
          className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center self-start text-[11px] transition-colors"
          style={{ height: ENTITY_CARD.chipHeight }}
        >
          {expanded ? "Hide" : `+${items.length - limit} more`}
        </button>
      )}
    </div>
  );
}

/** The bottom row of a card — the tooltip's copy buttons. */
export function EntityCardFooter({ children }: { children: ReactNode }) {
  return (
    <div
      className="border-border flex gap-2 border-t"
      style={{ padding: ENTITY_CARD.padding }}
    >
      {children}
    </div>
  );
}
