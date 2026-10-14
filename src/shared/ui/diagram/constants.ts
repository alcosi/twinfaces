/**
 * The one dashed stroke of the diagram, shared by the edges that lead to create
 * affordances, by those affordances' own outlines, and by the group boxes. CSS
 * `border-style: dashed` cannot be given a pattern, so the outlines are drawn as
 * SVG instead — that is the only way the two can be guaranteed to match.
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
export const SOLID_EDGE_WIDTH = 1.5;

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
 * Soft drop shadow of the design's cards. Pure decoration — every solid node
 * carries it, whether or not it does anything when clicked.
 */
export const NODE_SHADOW = "shadow-[0_1px_2px_0_rgba(15,23,42,0.06)]";

/**
 * Hover affordance for a card that navigates somewhere. Deliberately quiet: the
 * design's cards are flat, so hover lifts the border rather than the card.
 */
export const NODE_INTERACTIVE_HOVER =
  "hover:border-brand-400 hover:shadow-[0_4px_12px_-4px_rgba(15,23,42,0.12)]";
