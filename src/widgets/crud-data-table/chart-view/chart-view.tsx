"use client";

import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/shared/libs";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSpinner,
  PieChart,
  PieChartDatum,
  PieChartLegend,
  getPieChartColor,
} from "@/shared/ui";

/**
 * Client-side grouping descriptor: groups an in-memory dataset by a field and
 * (optionally) renders a rich legend label from a representative row.
 */
export type GroupableField<TData> = {
  /** Stable key used for selection state. */
  key: string;
  /** Human readable label shown on the toggle button and chart title. */
  label: string;
  /** Resolves the plain-text group label an individual row belongs to. */
  getGroup: (row: TData) => string | undefined;
  /**
   * Optional rich legend content for a group (e.g. a resource link), rendered
   * from a representative row of that group. Falls back to the plain label.
   */
  renderLabel?: (row: TData) => ReactNode;
};

/**
 * A single chart grouping. `load` resolves the aggregated slices — it may
 * aggregate client-side or call a server-side "count" endpoint.
 */
export type ChartGrouping = {
  key: string;
  label: string;
  load: (signal: AbortSignal) => Promise<PieChartDatum[]>;
};

const NO_VALUE_LABEL = "— Not set —";

/**
 * Above this many groups a pie chart becomes an unreadable confetti of thin
 * slices, so the breakdown is shown as a plain list instead.
 */
const MAX_CHART_SLICES = 50;

/** Aggregates an in-memory dataset into pie-chart slices for a given field. */
export function buildChartData<TData>(
  rows: TData[],
  field: GroupableField<TData>
): PieChartDatum[] {
  // Keep a representative row per group so rich labels (resource links) can be
  // rendered from real entity data.
  const groups = new Map<string, { value: number; row: TData }>();

  for (const row of rows) {
    const label = field.getGroup(row) ?? NO_VALUE_LABEL;
    const existing = groups.get(label);
    if (existing) {
      existing.value += 1;
    } else {
      groups.set(label, { value: 1, row });
    }
  }

  return Array.from(groups.entries())
    .sort((a, b) => b[1].value - a[1].value)
    .map(([label, { value, row }], index) => ({
      label,
      value,
      color: getPieChartColor(index),
      legendContent:
        label === NO_VALUE_LABEL ? undefined : field.renderLabel?.(row),
    }));
}

type ChartViewProps = {
  groupings: ChartGrouping[];
  /** Bumped externally (e.g. refresh button) to force a re-load. */
  refreshSignal?: number;
};

export function TableChartView({ groupings, refreshSignal }: ChartViewProps) {
  const [selectedKeys, setSelectedKeys] = useState<string[]>(() =>
    groupings[0] ? [groupings[0].key] : []
  );
  const [totals, setTotals] = useState<Record<string, number>>({});

  function toggle(key: string) {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  const handleLoaded = useCallback((key: string, total: number) => {
    setTotals((prev) =>
      prev[key] === total ? prev : { ...prev, [key]: total }
    );
  }, []);

  const selectedGroupings = useMemo(
    () => groupings.filter((g) => selectedKeys.includes(g.key)),
    [groupings, selectedKeys]
  );

  // All groupings describe the same population, so any loaded total is the
  // overall record count.
  const totalRecords = useMemo(() => {
    const values = selectedGroupings
      .map((g) => totals[g.key])
      .filter((v): v is number => typeof v === "number");
    return values.length ? Math.max(...values) : null;
  }, [selectedGroupings, totals]);

  return (
    <div className="mb-2 space-y-4">
      <div className="border-border flex flex-wrap items-center justify-between gap-3 rounded-md border p-3">
        <div className="flex flex-wrap items-center gap-2">
          {groupings.map((grouping) => {
            const active = selectedKeys.includes(grouping.key);
            return (
              <Button
                key={grouping.key}
                type="button"
                size="sm"
                variant={active ? "secondary" : "ghost"}
                className={cn(active && "border-border border")}
                onClick={() => toggle(grouping.key)}
              >
                {grouping.label}
              </Button>
            );
          })}
        </div>

        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <span>
            Total:{" "}
            <span className="text-foreground font-medium tabular-nums">
              {totalRecords ?? "…"}
            </span>
          </span>
          <span>
            Selected:{" "}
            <span className="text-foreground font-medium tabular-nums">
              {selectedKeys.length}/{groupings.length}
            </span>
          </span>
        </div>
      </div>

      {selectedGroupings.length === 0 ? (
        <div className="text-muted-foreground rounded-md border border-dashed p-8 text-center">
          Select a grouping above to draw a chart.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {selectedGroupings.map((grouping) => (
            <ChartCard
              key={grouping.key}
              grouping={grouping}
              refreshSignal={refreshSignal}
              onLoaded={handleLoaded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

type ChartCardProps = {
  grouping: ChartGrouping;
  refreshSignal?: number;
  onLoaded: (key: string, total: number) => void;
};

function ChartCard({ grouping, refreshSignal, onLoaded }: ChartCardProps) {
  const [data, setData] = useState<PieChartDatum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    grouping
      .load(controller.signal)
      .then((slices) => {
        if (controller.signal.aborted) return;
        setData(slices);
        onLoadedRef.current(
          grouping.key,
          slices.reduce((sum, slice) => sum + slice.value, 0)
        );
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [grouping, refreshSignal]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{grouping.label}</CardTitle>
        {data && <Badge variant="secondary">{data.length} groups</Badge>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">Failed to load chart data.</p>
        ) : !data || data.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data.</p>
        ) : data.length > MAX_CHART_SLICES ? (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              This grouping has {data.length} distinct values — too many to
              render as a readable chart. Showing the full breakdown as a list
              instead; apply more specific filters to narrow it down and
              visualize it as a pie chart.
            </p>
            <div className="max-h-96 overflow-y-auto pr-1">
              <PieChartLegend data={data} interactive={false} />
            </div>
          </div>
        ) : (
          <PieChart data={data} />
        )}
      </CardContent>
    </Card>
  );
}
