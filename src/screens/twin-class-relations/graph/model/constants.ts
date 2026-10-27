import { TwinClass_DETAILED } from "@/entities/twin-class";
import { getTwinClassTitle } from "@/features/twin-class/ui";
import { ENTITY_CARD, measureChipSection } from "@/shared/ui/entity-card";

import { CardExpansion, GraphMode } from "./types";

/**
 * Card geometry: the app-wide entity card's, plus what only the graph decides —
 * how wide its cards are and how much of a description a header may show.
 * Every number here is also a layout input: positions are computed before
 * anything renders, so the cards have to draw exactly this.
 */
export const CARD = {
  ...ENTITY_CARD,
  simpleWidth: 224,
  advancedWidth: 248,
  /** Longer blurbs are clamped rather than measured — see `countLines`. */
  descriptionLines: 2,
  /** Rough character budget of one description line at the header's width. */
  descriptionCharsPerLine: 30,
} as const;

export const PLACEHOLDER_SIZE = { width: 168, height: 36 } as const;

/**
 * Spacing of the canvas. The captions — "Head", "Children", "forward",
 * "backward" — are always drawn on their lines, so those lines are always long
 * enough to carry them. Only the branch to a linked card depends on the "Link
 * labels" switch: it carries the link's chip, and without one the same length
 * is just empty space.
 */
export const SPACING = {
  /** Between two cards stacked on one side. */
  stackGap: 16,
  /** Between two children in their row. */
  childGap: 24,
  /** From the children's bus line down to the children themselves. */
  busToChild: 40,
  /** Kept clear between the side stacks and the children's bus line. */
  stackToBus: 32,
  /** From the trunk to a create affordance. */
  trunkToPlaceholder: 48,
  /** From the centre card's side to the trunk — carries "forward". */
  sideReach: 120,
  /** Between the centre card and its head — carries "Head". */
  headGap: 72,
  /** From the centre card down to the bus line — carries "Children". */
  childDrop: 72,
  /** From the trunk to a linked card — carries the link's chip when shown. */
  branchReach: {
    withLabels: 200,
    withoutLabels: 48,
  },
} as const;

/** Widest a link chip may grow on its line before its name ellipsises. */
export const LINK_PILL_MAX_WIDTH = SPACING.branchReach.withLabels - 48;

export const getClassTitle = getTwinClassTitle;

/**
 * The line (or two) of context under a card's title: the description if the
 * class has one, its key otherwise. Shared by the card and by `measureCard` — if
 * the two disagreed on whether there is a subtitle, the card would be
 * mismeasured.
 */
export function getClassSubtitle(
  twinClass: TwinClass_DETAILED
): string | undefined {
  const text = twinClass.description || twinClass.key;
  return text && text !== getClassTitle(twinClass) ? text : undefined;
}

function countLines(
  text: string | undefined,
  charsPerLine: number,
  max: number
) {
  if (!text) return 0;
  return Math.min(Math.ceil(text.length / charsPerLine), max);
}

/**
 * Footprint of one class card, derived from its own content: the header, plus
 * in advanced mode a block of fields and a block of statuses — each as long as
 * its expansion makes it.
 */
export function measureCard(
  twinClass: TwinClass_DETAILED,
  mode: GraphMode,
  expansion: CardExpansion = {}
): { width: number; height: number } {
  const subtitle = getClassSubtitle(twinClass);

  if (mode === "simple") {
    const textHeight =
      CARD.titleLineHeight + (subtitle ? CARD.subtitleLineHeight : 0);

    return {
      width: CARD.simpleWidth,
      height: Math.max(textHeight, CARD.iconSize) + CARD.padding * 2,
    };
  }

  const descriptionHeight =
    countLines(subtitle, CARD.descriptionCharsPerLine, CARD.descriptionLines) *
    CARD.descriptionLineHeight;

  const headerHeight =
    Math.max(CARD.titleLineHeight + descriptionHeight, CARD.iconSize) +
    CARD.padding * 2;

  return {
    width: CARD.advancedWidth,
    height:
      headerHeight +
      measureChipSection(twinClass.fields?.length ?? 0, expansion.fields) +
      measureChipSection(twinClass.statuses?.length ?? 0, expansion.statuses),
  };
}
