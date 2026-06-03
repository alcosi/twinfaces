import { ReactNode } from "react";

import { cn } from "@/shared/libs";

export interface PieChartDatum {
  /** Plain-text label, used for tooltips and accessibility. */
  label: string;
  value: number;
  /** Optional explicit color. Falls back to the built-in palette by index. */
  color?: string;
  /**
   * Optional rich content rendered in the legend instead of the plain label
   * (e.g. a resource link). The plain `label` is still used for the tooltip.
   */
  legendContent?: ReactNode;
}

export interface PieChartProps {
  data: PieChartDatum[];
  /** Outer diameter in pixels. */
  size?: number;
  /** Ring thickness in pixels. Smaller than size/2 keeps it a donut. */
  thickness?: number;
  /** Hide the legend rendered next to the donut. */
  hideLegend?: boolean;
  className?: string;
}

/**
 * Pleasant, theme-agnostic palette that reads well in both light and dark mode.
 * Slices cycle through it by index when no explicit color is provided.
 */
export const PIE_CHART_PALETTE = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#a855f7", // purple
  "#ec4899", // pink
  "#84cc16", // lime
  "#f97316", // orange
  "#14b8a6", // teal
] as const;

export function getPieChartColor(index: number): string {
  return PIE_CHART_PALETTE[index % PIE_CHART_PALETTE.length] ?? "#6366f1";
}

/**
 * Dependency-free SVG donut chart. Segments are drawn as dashed circle strokes
 * so there is no arc-path math and the full-circle (single slice) case renders
 * cleanly.
 */
export function PieChart({
  data,
  size = 180,
  thickness = 28,
  hideLegend = false,
  className,
}: PieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulated = 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Pie chart"
        className="shrink-0"
      >
        {/* Track behind the segments */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          className="stroke-muted"
          strokeWidth={thickness}
        />

        <g transform={`rotate(-90 ${center} ${center})`}>
          {total > 0 &&
            data.map((datum, index) => {
              const fraction = datum.value / total;
              const dash = fraction * circumference;
              const segment = (
                <circle
                  key={`${datum.label}-${index}`}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={datum.color ?? getPieChartColor(index)}
                  strokeWidth={thickness}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-accumulated}
                >
                  <title>{`${datum.label}: ${datum.value} (${Math.round(
                    fraction * 100
                  )}%)`}</title>
                </circle>
              );
              accumulated += dash;
              return segment;
            })}
        </g>

        {/* Total in the middle of the donut */}
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          className="fill-foreground text-2xl font-semibold"
        >
          {total}
        </text>
        <text
          x={center}
          y={center + 16}
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
        >
          total
        </text>
      </svg>

      {!hideLegend && (
        <ul className="min-w-0 flex-1 space-y-1.5">
          {data.map((datum, index) => {
            const percent = total > 0 ? (datum.value / total) * 100 : 0;
            return (
              <li
                key={`${datum.label}-${index}`}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: datum.color ?? getPieChartColor(index),
                  }}
                />
                <span
                  className="flex min-w-0 flex-1 truncate"
                  title={datum.label}
                >
                  {datum.legendContent ?? datum.label}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {datum.value} ({percent.toFixed(1)}%)
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
