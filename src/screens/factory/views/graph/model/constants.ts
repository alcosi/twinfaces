import { DiagramNodeKind } from "./types";

/**
 * Internal layout of a factory node. It is three columns: the card, a connector
 * column holding the bracket ("spider") that fans out to the chips, and the chip
 * rail itself. Kept here because the flow edges have to line up with the card's
 * centre rather than the node's, and the connector has to be drawn to the same
 * measurements the chips are laid out by.
 */
export const FACTORY_NODE = {
  cardWidth: 196,
  /** Wide enough for the spider's elbows to read as curves, not as kinks. */
  connectorWidth: 52,
  railWidth: 152,
  chipHeight: 30,
  chipGap: 16,
  /** Corner radius of the spider's elbows. */
  spiderRadius: 12,
  /** Breathing room above and below the chip stack. */
  railPadding: 10,
} as const;

/** X of the card's centre — where a factory node's flow edges attach. */
export const FACTORY_CARD_CENTER_X = FACTORY_NODE.cardWidth / 2;

/** Height of a chip stack of `count` chips, gaps included. */
export function getChipStackHeight(count: number): number {
  return (
    count * FACTORY_NODE.chipHeight +
    Math.max(count - 1, 0) * FACTORY_NODE.chipGap
  );
}

/**
 * Node footprints handed to elk. They must match what the node components
 * actually render, otherwise the layout leaves gaps or overlaps.
 */
export const NODE_SIZE: Record<
  DiagramNodeKind,
  { width: number; height: number }
> = {
  // Card + spider connector + chip rail; see FACTORY_NODE. The height follows
  // the chip stack, so the rail never has to squeeze its chips together.
  factory: {
    width:
      FACTORY_NODE.cardWidth +
      FACTORY_NODE.connectorWidth +
      FACTORY_NODE.railWidth,
    height: getChipStackHeight(3) + FACTORY_NODE.railPadding * 2,
  },
  entity: { width: 196, height: 48 },
  // Wide enough that the label fits inside the rotated square rather than
  // spilling over its edges — see DIAMOND_SIDE.
  decision: { width: 152, height: 104 },
  outcome: { width: 176, height: 40 },
  placeholder: { width: 152, height: 44 },
};

/**
 * Side of the square that, rotated 45°, forms a decision diamond. Its diagonal
 * (side × √2) is the widest line through the centre, so the label has to stay
 * inside {@link DIAMOND_LABEL_WIDTH} to read as being within the shape.
 */
export const DIAMOND_SIDE = 72;
export const DIAMOND_LABEL_WIDTH = Math.floor(DIAMOND_SIDE * Math.SQRT2) - 12;

/**
 * Bounding box of that rotated square — the footprint an SVG diamond needs to
 * occupy to line up with the CSS-rotated one.
 */
export const DIAMOND_BOX = Math.round(DIAMOND_SIDE * Math.SQRT2);

/**
 * The one dashed stroke of the diagram, shared by the edges that lead to create
 * affordances and by those affordances' own outlines. CSS `border-style: dashed`
 * cannot be given a pattern, so the outlines are drawn as SVG instead — that is
 * the only way the two can be guaranteed to match.
 */
export const DASHED_STROKE = {
  dashArray: "5 4",
  width: 1.5,
} as const;

/**
 * Solid edges are drawn a touch heavier than the dashed ones. Partly hierarchy —
 * a real connection outranks a create hint — and partly coverage: solid and
 * dashed edges share the trunk exactly, and at equal widths the dashes' own
 * antialiased fringes still show past the solid line laid over them.
 */
export const SOLID_EDGE_WIDTH = 2;

/**
 * The diagram's line colour, for every edge and for the dashed outlines alike.
 *
 * Published as a CSS variable on the canvas because the two consumers cannot
 * share a value any other way: an edge takes a plain CSS string in React Flow's
 * `style`, while an outline needs a Tailwind text colour so `currentColor` and
 * the brand hover keep working. Derived from a theme token, so it still follows
 * light and dark mode — React Flow's own default is a hard-coded grey that sits
 * visibly darker than `--border`.
 */
export const DIAGRAM_STROKE_VAR = "--diagram-stroke";
/**
 * Mixed towards the background rather than towards `transparent`: the rendered
 * colour is the same, but it is opaque. A translucent stroke would let a dashed
 * edge sitting under a solid one add up through it, banding the shared trunk.
 */
export const DIAGRAM_STROKE_COLOR =
  "color-mix(in srgb, var(--muted-foreground) 55%, var(--background))";
/** Reference to the variable above, for `style` values and Tailwind classes. */
export const DIAGRAM_STROKE = `var(${DIAGRAM_STROKE_VAR})`;

/**
 * Routing for every edge, so that all the edges leaving one node share a single
 * horizontal trunk.
 *
 * `stepPosition: 0` is what does it: React Flow places the horizontal run at
 * `sourceY + offset + (targetY - offset - sourceY - offset) * stepPosition`, so
 * at 0 the run sits a fixed distance below the source and no longer depends on
 * where the target happens to be. With the default 0.5 each edge bends at its
 * own height, and since children of a layer differ in height, dashed and solid
 * edges ended up as parallel lines a dozen pixels apart.
 */
export const EDGE_PATH_OPTIONS = {
  offset: 24,
  stepPosition: 0,
  borderRadius: 8,
} as const;

/**
 * Visible vertical run between the shared trunk and the row beneath it.
 *
 * Kept explicit — and {@link LAYER_SPACING} derived from it — because the two
 * numbers are coupled: the trunk eats `offset` out of the gap between layers, so
 * hard-coding the layer spacing on its own leaves whatever remains, and the
 * fan-out edges end up as stubs with the arrowheads sitting on the nodes.
 */
export const TRUNK_DESCENT = 68;

/** Gap elk leaves between layers: the trunk's own offset plus the descent. */
export const LAYER_SPACING = EDGE_PATH_OPTIONS.offset + TRUNK_DESCENT;

/**
 * Soft drop shadow, lifted verbatim from the twin class Graph tab so both
 * diagrams read as one system. Pure decoration — every solid node carries it,
 * whether or not it does anything when clicked.
 */
export const NODE_SHADOW = "shadow-[0_10px_34px_-28px_rgba(15,23,42,0.8)]";

/**
 * Hover affordance, and only that: it belongs on nodes that expand into the Node
 * view or navigate somewhere, never on inert ones like the `input class`
 * diamonds. Clearly stronger than {@link NODE_SHADOW} — a shadow that merely
 * shifts its spread by a few pixels reads as no feedback at all.
 */
export const NODE_INTERACTIVE_HOVER =
  "hover:shadow-[0_12px_26px_-12px_rgba(15,23,42,0.45)] hover:brightness-[0.97]";

/**
 * Emphasis for the element the Node view is currently expanded on. Uses the
 * theme's accent (`--ring`, the brand colour) rather than `--primary`, which is
 * near-black and reads as a mis-styled outline.
 */
export const NODE_ACTIVE_RING =
  "ring-ring/70 ring-offset-background ring-2 ring-offset-2";

/**
 * Per-factory palette. Mirrors the reference diagrams, where every factory of
 * the cascade owns a colour that its whole subtree inherits. Kept as explicit
 * Tailwind classes so the JIT compiler keeps them.
 */
export const TONE_STYLES = [
  {
    solid: "bg-emerald-100 border-emerald-500 text-emerald-950",
    outline: "border-emerald-500 text-emerald-900",
  },
  {
    solid: "bg-sky-100 border-sky-500 text-sky-950",
    outline: "border-sky-500 text-sky-900",
  },
  {
    solid: "bg-amber-100 border-amber-500 text-amber-950",
    outline: "border-amber-500 text-amber-900",
  },
  {
    solid: "bg-violet-100 border-violet-500 text-violet-950",
    outline: "border-violet-500 text-violet-900",
  },
  {
    solid: "bg-rose-100 border-rose-500 text-rose-950",
    outline: "border-rose-500 text-rose-900",
  },
] as const;

export function getToneStyles(tone: number) {
  return TONE_STYLES[tone % TONE_STYLES.length]!;
}
