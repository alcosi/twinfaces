/**
 * Geometry of every entity card — in the graphs, in the resource link tooltips
 * and in the table card view alike.
 *
 * The graphs lay their cards out before anything renders, so they compute each
 * card's height from these very numbers; the components draw with them too.
 * Change one and both sides move together.
 */
export const ENTITY_CARD = {
  /** Padding inside a card, and inside each of its sections. */
  padding: 12,
  /** Icon tile beside the title. */
  iconSize: 28,
  titleLineHeight: 18,
  /** A one-line subtitle — a key, a short blurb. */
  subtitleLineHeight: 15,
  /** A subtitle clamped over several lines. */
  descriptionLineHeight: 14,
  sectionLabelHeight: 18,
  /** Between a section's caption and its content. */
  sectionGap: 8,
  chipHeight: 24,
  chipGap: 6,
  /**
   * Chips a list shows before the rest collapse into a "+N more" row — an
   * entity with forty fields would otherwise be a card taller than the screen.
   */
  chipLimit: 4,
  /** Border between two sections. */
  dividerHeight: 1,
} as const;

/**
 * Rows a chip list takes. Folded, it is the first few chips plus the "+N more"
 * row; unfolded, every chip plus the "Hide" row.
 */
export function chipListRows(
  total: number,
  expanded = false,
  limit: number = ENTITY_CARD.chipLimit
): number {
  if (total <= limit) return total;
  return (expanded ? total : limit) + 1;
}

/** Height of a section holding nothing but a chip list. */
export function measureChipSection(total: number, expanded = false): number {
  if (total === 0) return 0;

  const rows = chipListRows(total, expanded);

  return (
    ENTITY_CARD.dividerHeight +
    ENTITY_CARD.padding +
    ENTITY_CARD.sectionLabelHeight +
    ENTITY_CARD.sectionGap +
    rows * ENTITY_CARD.chipHeight +
    Math.max(rows - 1, 0) * ENTITY_CARD.chipGap +
    ENTITY_CARD.padding
  );
}
