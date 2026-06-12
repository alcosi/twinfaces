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

/** Page window requested for a single chart-grouping load. */
export type ChartLoadParams = {
  offset: number;
  limit: number;
  signal: AbortSignal;
};

/** One page of a chart grouping: the slices plus the total group count. */
export type ChartSlicePage = {
  data: PieChartDatum[];
  /** Total number of distinct groups for this grouping (across all pages). */
  total: number;
};

/**
 * A single chart grouping. `load` resolves one page of aggregated slices — it
 * may aggregate client-side or call a server-side "count" endpoint. When the
 * total group count exceeds {@link MAX_CHART_SLICES} the chart view pages
 * through the breakdown via infinite scroll, requesting successive windows.
 */
export type ChartGrouping = {
  key: string;
  label: string;
  load: (params: ChartLoadParams) => Promise<ChartSlicePage>;
};

const NO_VALUE_LABEL = "— Not set —";

/**
 * Above this many groups a pie chart becomes an unreadable confetti of thin
 * slices, so the breakdown is shown as a scrollable list instead. It doubles as
 * the page size: a first page of this size holds every group whenever the total
 * is chart-able, so the pie can render without a second request.
 */
const MAX_CHART_SLICES = 50;

/**
 * Adapts a server-side grouped `/count` fetcher into a paginated chart-grouping
 * loader. Forwards the requested page window to the endpoint, reports the total
 * group count, and colors each slice by its absolute position so the palette
 * stays stable as later pages are appended. Slices are sorted by descending
 * count to keep the largest groups (and the pie chart) readable.
 */
export function buildCountGroupingLoad<TGroup extends { count: number }>(
  fetchPage: (page: {
    offset: number;
    limit: number;
  }) => Promise<{ items: TGroup[]; total: number }>,
  getId: (group: TGroup) => string | undefined,
  getLabel: (group: TGroup) => string | undefined,
  renderLabel?: (group: TGroup) => ReactNode
): ChartGrouping["load"] {
  return async ({ offset, limit }) => {
    const { items, total } = await fetchPage({ offset, limit });

    const data = items
      .slice()
      .sort((a, b) => b.count - a.count)
      .map((group, index) => ({
        label: getLabel(group) ?? getId(group) ?? NO_VALUE_LABEL,
        value: group.count,
        color: getPieChartColor(offset + index),
        legendContent: renderLabel?.(group),
      }));

    return { data, total };
  };
}

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
      <div className="border-brand-500/10 bg-brand-500/5 flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {groupings.map((grouping) => {
            const active = selectedKeys.includes(grouping.key);
            return (
              <Button
                key={grouping.key}
                type="button"
                size="sm"
                variant="ghost"
                className={cn(
                  "rounded-lg transition-colors duration-200",
                  active
                    ? "bg-brand-500/10 text-brand-600 hover:bg-brand-500/15"
                    : "hover:bg-background/60"
                )}
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
  const [data, setData] = useState<PieChartDatum[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  // Number of groups loaded so far; the next page starts at this offset.
  const loadedRef = useRef(0);
  // Synchronous guard so rapid observer callbacks can't request the same page
  // twice before `loadingMore` state settles.
  const loadingMoreRef = useRef(false);
  // Controller for the current (grouping, refresh) generation. The first page
  // and every `loadMore` share it, so switching grouping aborts both.
  const controllerRef = useRef<AbortController | null>(null);

  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // (Re)load the first page whenever the grouping or a manual refresh changes.
  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setLoadingMore(false);
    setError(false);
    setData([]);
    setTotal(null);
    loadedRef.current = 0;
    loadingMoreRef.current = false;

    grouping
      .load({ offset: 0, limit: MAX_CHART_SLICES, signal: controller.signal })
      .then((page) => {
        if (controller.signal.aborted) return;
        setData(page.data);
        setTotal(page.total);
        loadedRef.current = page.data.length;
        onLoadedRef.current(
          grouping.key,
          page.data.reduce((sum, slice) => sum + slice.value, 0)
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

  const hasMore = total !== null && loadedRef.current < total;
  const isListView = total !== null && total > MAX_CHART_SLICES;

  const loadMore = useCallback(() => {
    const controller = controllerRef.current;
    if (
      !controller ||
      controller.signal.aborted ||
      loadingMoreRef.current ||
      total === null ||
      loadedRef.current >= total
    ) {
      return;
    }

    const totalGroups = total;
    const offset = loadedRef.current;
    loadingMoreRef.current = true;
    setLoadingMore(true);

    grouping
      .load({ offset, limit: MAX_CHART_SLICES, signal: controller.signal })
      .then((page) => {
        if (controller.signal.aborted) return;
        // A short/empty page means the grouping is drained; pin the cursor to
        // the total so `hasMore` flips off and paging stops.
        loadedRef.current = page.data.length
          ? offset + page.data.length
          : totalGroups;
        setData((prev) => [...prev, ...page.data]);
      })
      .catch(() => {
        // Stop paging on error; the groups loaded so far stay visible.
        if (!controller.signal.aborted) loadedRef.current = totalGroups;
      })
      .finally(() => {
        loadingMoreRef.current = false;
        if (!controller.signal.aborted) setLoadingMore(false);
      });
  }, [grouping, total]);

  // Keep the latest `loadMore` in a ref so the observer survives re-renders.
  const loadMoreRef = useRef(loadMore);
  loadMoreRef.current = loadMore;

  // Infinite scroll for the list view: page in more groups once the sentinel
  // near the bottom of the scroll container becomes visible.
  useEffect(() => {
    if (!isListView || !hasMore) return;

    const root = listRef.current;
    const target = sentinelRef.current;
    if (!root || !target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          loadMoreRef.current();
        }
      },
      { root, rootMargin: "120px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isListView, hasMore, data.length]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">{grouping.label}</CardTitle>
        {total !== null && <Badge variant="secondary">{total} groups</Badge>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <p className="text-destructive text-sm">Failed to load chart data.</p>
        ) : total === 0 || data.length === 0 ? (
          <p className="text-muted-foreground text-sm">No data.</p>
        ) : isListView ? (
          <div className="space-y-3">
            <p className="text-muted-foreground text-sm">
              This grouping has {total} distinct values — too many to render as
              a readable chart. Showing the breakdown as a scrollable list
              instead; apply more specific filters to narrow it down and
              visualize it as a pie chart.
            </p>
            <div ref={listRef} className="max-h-96 overflow-y-auto pr-1">
              <PieChartLegend data={data} interactive={false} />
              {hasMore && (
                <div ref={sentinelRef} aria-hidden className="h-px" />
              )}
              {loadingMore && (
                <div className="text-muted-foreground py-2 text-center text-xs">
                  Loading…
                </div>
              )}
            </div>
          </div>
        ) : (
          <PieChart data={data} />
        )}
      </CardContent>
    </Card>
  );
}
