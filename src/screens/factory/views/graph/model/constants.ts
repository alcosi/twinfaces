import { DiagramNode, GraphMode, GraphSection } from "./types";

// The stroke, the shadow and the hover are shared with every other diagram of
// the app, so they live in `shared/ui/diagram`. Re-exported so the factory
// graph keeps reading all of its geometry from one place.
export {
  DASHED_STROKE,
  DIAGRAM_STROKE,
  DIAGRAM_STROKE_COLOR,
  DIAGRAM_STROKE_VAR,
  NODE_INTERACTIVE_HOVER,
  NODE_SHADOW,
  SOLID_EDGE_WIDTH,
} from "@/shared/ui/diagram/constants";

/**
 * Card geometry. Every number here is also a layout input: elk is told how big
 * each node is before anything renders, so these have to match what the node
 * components actually draw — otherwise the graph either overlaps or leaves gaps.
 */
export const CARD = {
  simpleWidth: 208,
  advancedWidth: 232,
  /** Padding inside a card, and the gap between a header and its first block. */
  padding: 12,
  /** Icon tile beside the title. */
  iconSize: 28,
  titleLineHeight: 18,
  sublabelLineHeight: 15,
  descriptionLineHeight: 14,
  /** Longer blurbs are clamped rather than measured — see `countLines`. */
  descriptionLines: 3,
  /** Rough character budget of one description line at the header's width. */
  descriptionCharsPerLine: 26,
  sectionLabelHeight: 15,
  sectionGap: 6,
  chipHeight: 24,
  chipGap: 6,
  /** Border between two blocks of a card. */
  dividerHeight: 1,
} as const;

export const PLACEHOLDER_SIZE = { width: 152, height: 36 } as const;

/**
 * Rows of a factory group, top to bottom. The builder tags each node with one
 * and the layout turns them into the rows themselves, so both sides have to
 * agree on the order — hence a shared constant rather than two literals.
 */
export const GRAPH_ROW = {
  factory: 0,
  multipliers: 1,
  flow: 2,
  handover: 3,
} as const;

/**
 * Padding of a factory group box. The top is deeper than the rest: the group's
 * caption sits inside that band, above its first row of cards.
 */
export const GROUP_PADDING = {
  top: 34,
  right: 24,
  bottom: 24,
  left: 24,
} as const;

/**
 * The one line (or few) of context under a card's title.
 *
 * Several cascade entities have no name of their own, so the builder already
 * uses their description as the title — repeating it underneath would just print
 * the same sentence twice. Shared by the renderer and by `measureNode`: if the
 * two disagreed on whether there is a subtitle, every such card would be
 * mismeasured.
 */
export function getNodeSubtitle(
  node: Pick<DiagramNode, "label" | "sublabel" | "description">,
  mode: GraphMode
): string | undefined {
  const text =
    mode === "advanced" ? (node.description ?? node.sublabel) : node.sublabel;

  return text && text !== node.label ? text : undefined;
}

function countLines(
  text: string | undefined,
  charsPerLine: number,
  max: number
) {
  if (!text) return 0;
  return Math.min(Math.ceil(text.length / charsPerLine), max);
}

function measureSection(section: GraphSection): number {
  const chips = section.chips.length;

  return (
    CARD.dividerHeight +
    CARD.padding +
    CARD.sectionLabelHeight +
    CARD.sectionGap +
    chips * CARD.chipHeight +
    Math.max(chips - 1, 0) * CARD.chipGap +
    CARD.padding
  );
}

/**
 * Footprint of one card, derived from its own content: the header, plus each
 * block of chips. Heights are computed rather than fixed because an advanced
 * pipeline card carrying five steps is twice the card a bare branch is.
 */
export function measureNode(
  node: Pick<
    DiagramNode,
    "kind" | "label" | "sublabel" | "description" | "sections"
  >,
  mode: GraphMode
): { width: number; height: number } {
  if (node.kind === "placeholder") return PLACEHOLDER_SIZE;

  const subtitle = getNodeSubtitle(node, mode);

  if (mode === "simple") {
    const textHeight =
      CARD.titleLineHeight + (subtitle ? CARD.sublabelLineHeight : 0);

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

  const sectionsHeight = (node.sections ?? []).reduce(
    (total, section) => total + measureSection(section),
    0
  );

  return { width: CARD.advancedWidth, height: headerHeight + sectionsHeight };
}

/**
 * Routing for every edge: one trunk straight down from the source, fanning out
 * just above the row it lands in.
 *
 * `stepPosition` is what decides that. React Flow places the horizontal run at
 * `sourceY + offset + (targetY - offset - sourceY - offset) * stepPosition`, so
 * at 1 it sits a fixed distance above the target rather than below the source.
 * That matters because a factory feeds two rows at once: with the run just below
 * the source, every edge bound for the pipelines peeled off immediately and then
 * dropped straight through the multiplier row's cards. Kept above the target,
 * the vertical part of all those edges coincides in one trunk under the factory,
 * and the only row it crosses is cleared by {@link TRUNK_CORRIDOR}.
 *
 * Rows are top-aligned, so the targets of one row share a `targetY` and
 * therefore a single horizontal run — no parallel lines a few pixels apart.
 */
export const EDGE_PATH_OPTIONS = {
  offset: 24,
  stepPosition: 1,
  borderRadius: 8,
} as const;

/**
 * Width of the gap kept clear down the middle of the rows the trunk passes
 * through on its way to a lower row. Wide enough that the line reads as running
 * between two cards rather than grazing one.
 */
export const TRUNK_CORRIDOR = 44;

/**
 * Visible vertical run between the shared trunk and the row beneath it.
 *
 * Kept explicit — and {@link LAYER_SPACING} derived from it — because the two
 * numbers are coupled: the trunk eats `offset` out of the gap between layers, so
 * hard-coding the layer spacing on its own leaves whatever remains, and the
 * fan-out edges end up as stubs with the arrowheads sitting on the nodes.
 */
export const TRUNK_DESCENT = 56;

/** Gap elk leaves between layers: the trunk's own offset plus the descent. */
export const LAYER_SPACING = EDGE_PATH_OPTIONS.offset + TRUNK_DESCENT;
