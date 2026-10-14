import { cn } from "@/shared/libs";

import { DASHED_STROKE } from "./constants";

/**
 * The dashed outline of a create affordance and of a group box, drawn as SVG so
 * it carries the exact same dash pattern as the edge arriving at it —
 * `border-dashed` would leave the browser to pick its own pattern.
 *
 * Takes its colour from `currentColor`, so hover states come from the parent.
 */
export function DashedOutline({
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
