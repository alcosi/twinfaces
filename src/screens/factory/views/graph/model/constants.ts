import { DiagramNodeKind } from "./types";

/**
 * Node footprints handed to elk. They must match what the node components
 * actually render, otherwise the layout leaves gaps or overlaps.
 */
export const NODE_SIZE: Record<
  DiagramNodeKind,
  { width: number; height: number }
> = {
  // Wide enough to hold the title plus the chip rail (multipliers / erasers /
  // condition sets) that the factory node renders beside it.
  factory: { width: 356, height: 112 },
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
