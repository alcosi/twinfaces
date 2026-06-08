"use client";

import { ReactNode, useState } from "react";

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

/** Converts an HSL (h°, s%, l%) color to a `#rrggbb` hex string. */
function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100;
  const lNorm = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const channel = (n: number) => {
    const value =
      lNorm - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * value)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

/**
 * Theme-agnostic palette of 50 visually distinct colors that read well in both
 * light and dark mode. Hues are spread by the golden angle so adjacent slices
 * never look alike, and the band of 50 entries makes any repetition cycle long
 * enough to be invisible for realistic group counts.
 */
export const PIE_CHART_PALETTE: readonly string[] = Array.from(
  { length: 50 },
  (_, index) => {
    const hue = (index * 137.508) % 360;
    const saturation = 62 + (index % 3) * 9; // 62 / 71 / 80
    const lightness = 58 - (index % 2) * 10; // 58 / 48
    return hslToHex(hue, saturation, lightness);
  }
);

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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  // How far the hovered slice is pulled out of the ring, in user units.
  const explodeBy = thickness * 0.28;

  let accumulated = 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-6", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Pie chart"
        className="shrink-0 overflow-visible"
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
              const isActive = activeIndex === index;
              const isDimmed = activeIndex !== null && !isActive;

              // Pull the hovered slice outward along its mid-angle. The angle
              // is measured in the segment's local (pre-rotation) space, where
              // the stroke starts at 3 o'clock and runs clockwise.
              const midAngle =
                ((accumulated + dash / 2) / circumference) * 2 * Math.PI;
              const dx = isActive ? Math.cos(midAngle) * explodeBy : 0;
              const dy = isActive ? Math.sin(midAngle) * explodeBy : 0;

              const segment = (
                <circle
                  key={`${datum.label}-${index}`}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={datum.color ?? getPieChartColor(index)}
                  strokeWidth={isActive ? thickness + 6 : thickness}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-accumulated}
                  opacity={isDimmed ? 0.35 : 1}
                  className="cursor-pointer transition-all duration-150 ease-out"
                  style={{ transform: `translate(${dx}px, ${dy}px)` }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
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
        <PieChartLegend
          data={data}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
        />
      )}
    </div>
  );
}

/**
 * Standalone legend for a pie-chart dataset: one row per slice with its color
 * swatch, label (or rich `legendContent`) and value/percentage. Reused on its
 * own to present a breakdown as a plain list when there are too many groups to
 * draw a readable chart.
 */
export function PieChartLegend({
  data,
  className,
  activeIndex,
  onActiveIndexChange,
  interactive = true,
}: {
  data: PieChartDatum[];
  className?: string;
  /** Controlled highlighted row; pairs with the chart's hovered slice. */
  activeIndex?: number | null;
  /** Notifies the owner (e.g. the chart) which row is being hovered. */
  onActiveIndexChange?: (index: number | null) => void;
  /**
   * Whether rows respond to hover (highlight/dim). Disable when the legend
   * stands alone with no chart to coordinate with.
   */
  interactive?: boolean;
}) {
  const [internalActive, setInternalActive] = useState<number | null>(null);
  const isControlled = activeIndex !== undefined;
  const active = isControlled ? activeIndex : internalActive;

  function handleHover(index: number | null) {
    if (!isControlled) setInternalActive(index);
    onActiveIndexChange?.(index);
  }

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <ul className={cn("min-w-0 flex-1 space-y-1.5", className)}>
      {data.map((datum, index) => {
        const percent = total > 0 ? (datum.value / total) * 100 : 0;
        const isActive = interactive && active === index;
        const isDimmed = interactive && active != null && !isActive;
        return (
          <li
            key={`${datum.label}-${index}`}
            className={cn(
              "flex items-center gap-2 rounded px-1.5 py-0.5 text-sm transition-all duration-150",
              interactive && "cursor-pointer",
              isActive && "bg-muted font-medium",
              isDimmed && "opacity-40"
            )}
            onMouseEnter={interactive ? () => handleHover(index) : undefined}
            onMouseLeave={interactive ? () => handleHover(null) : undefined}
          >
            <span
              className="size-3 shrink-0 rounded-full"
              style={{
                backgroundColor: datum.color ?? getPieChartColor(index),
              }}
            />
            <span className="flex min-w-0 flex-1 truncate" title={datum.label}>
              {datum.legendContent ?? datum.label}
            </span>
            <span className="text-muted-foreground tabular-nums">
              {datum.value} ({percent.toFixed(1)}%)
            </span>
          </li>
        );
      })}
    </ul>
  );
}
