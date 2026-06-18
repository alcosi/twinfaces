import { ChartPie, Plus, RefreshCw, Search } from "lucide-react";
import { ForwardedRef, useCallback, useEffect } from "react";

import { AutoFormValueInfo } from "@/components/auto-field";

import { SortV1 } from "@/shared/api";
import { debounce, fixedForwardRef, isPopulatedArray } from "@/shared/libs";
import { GridIcon, Input, RowsIcon } from "@/shared/ui";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";

import { DataTableHandle, DataTableProps, DataTableRow } from "../data-table";
import { safeRefresh, safeResetPage } from "../helpers";
import { useViewSettings } from "../hooks";
import { FiltersSidebar } from "./filters-sidebar";
import { GroupByButton } from "./group-by-button";
import { SortControl, SortableFieldOption } from "./sort-control";
import { ViewMode, ViewModeOption, ViewModeToggle } from "./view-mode-toggle";

export type TableViewState = {
  query: string;
  filters: Record<string, unknown>;
  visibleKeys: string[];
  orderKeys: string[];
  groupByKey?: string;
  layoutMode: "grid" | "list";
  sort?: SortV1;
};

export type TableViewStateUpdate = Partial<Omit<TableViewState, "filters">> & {
  filters?: Record<string, unknown> | null;
};

export type CrudDataTableHeaderProps = {
  title?: string;
  search?: {
    enabled?: boolean;
    placeholder?: string;
  };
  filters?: {
    filtersInfo: Record<string, AutoFormValueInfo>;
  };
  hideRefresh?: boolean;
  /** Whether the table/pie-chart view toggle is available. */
  chartViewEnabled?: boolean;
  /** Whether the pie-chart breakdown view is currently active. */
  chartMode?: boolean;
  onChartModeChange?: (mode: boolean) => void;
  /** Re-fetch the chart dataset (used by the refresh button while in chart mode). */
  onChartRefresh?: () => void;
  onCreateClick?: () => void;
  onViewSettingsChange?: (data: TableViewState) => void;
  /**
   * When provided, a toolbar sort dropdown is rendered. Use this for layouts
   * without clickable column headers (the card view) so the dataset can still
   * be sorted. Drives the same sort state as {@link SortableHeader}.
   */
  sortableFields?: SortableFieldOption[];
  /** Initial layout when nothing is persisted yet. Defaults to "grid". */
  defaultLayoutMode?: "grid" | "list";
  /** Hide the table (grid) view option — e.g. for a card-only dataset. */
  disableGridView?: boolean;
};

type Props<
  TData extends DataTableRow<TData>,
  TValue,
> = CrudDataTableHeaderProps & {
  columns: DataTableProps<TData, TValue>["columns"];
  defaultVisibleColumns?: DataTableProps<TData, TValue>["columns"];
  orderedColumns?: DataTableProps<TData, TValue>["columns"];
  groupableColumns?: DataTableProps<TData, TValue>["columns"];
};

function CrudDataTableHeaderComponent<
  TData extends DataTableRow<TData>,
  TValue,
>(
  {
    title,
    search,
    hideRefresh,
    filters,
    columns,
    defaultVisibleColumns,
    orderedColumns,
    groupableColumns,
    chartViewEnabled,
    chartMode,
    onChartModeChange,
    onChartRefresh,
    onCreateClick,
    onViewSettingsChange,
    sortableFields,
    defaultLayoutMode,
    disableGridView,
  }: Props<TData, TValue>,
  tableRef: ForwardedRef<DataTableHandle>
) {
  const { viewSettings, updateViewSettings } = useViewSettings(
    defaultVisibleColumns,
    orderedColumns,
    columns,
    defaultLayoutMode
  );

  const debouncedUpdate = useCallback(
    debounce(
      (updates: TableViewStateUpdate) => updateViewSettings(updates),
      150
    ),
    []
  );

  useEffect(() => {
    onViewSettingsChange?.(viewSettings);
  }, [viewSettings, onViewSettingsChange]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    safeResetPage(tableRef);
  };

  // Table / card / pie-chart switcher. The chart segment only appears when a
  // chart breakdown is configured for this table.
  const viewModeOptions: ViewModeOption[] = [
    ...(disableGridView
      ? []
      : [{ value: "grid" as const, label: "Table view", icon: GridIcon }]),
    { value: "list", label: "Card view", icon: RowsIcon },
    ...(chartViewEnabled
      ? [{ value: "chart" as const, label: "Pie charts", icon: ChartPie }]
      : []),
  ];

  const currentViewMode: ViewMode = chartMode
    ? "chart"
    : viewSettings.layoutMode;

  const handleViewModeChange = (mode: ViewMode) => {
    if (mode === "chart") {
      onChartModeChange?.(true);
      return;
    }
    if (chartMode) onChartModeChange?.(false);
    updateViewSettings({ layoutMode: mode });
  };

  return (
    <div className="mb-2 flex justify-between">
      <div className="flex items-center">
        {title && <div className="text-lg">{title}</div>}
        {search?.enabled && (
          <form className="flex flex-row space-x-1" onSubmit={handleSearch}>
            <Input
              placeholder={search.placeholder ?? "Search..."}
              value={viewSettings.query}
              onChange={(e) => debouncedUpdate({ query: e.target.value })}
              className="max-w-sm"
            />
            <Button variant="ghost" type="submit">
              <Search />
            </Button>
          </form>
        )}
      </div>
      <div className="flex space-x-1">
        {!hideRefresh && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              chartMode ? onChartRefresh?.() : safeRefresh(tableRef)
            }
          >
            <RefreshCw />
          </Button>
        )}

        {filters && (
          <FiltersSidebar
            filtersInfo={filters.filtersInfo}
            filters={viewSettings.filters}
            onChange={async (values) => debouncedUpdate({ filters: values })}
          />
        )}

        {/* Sort dropdown for the card view only: it has no clickable column
            headers, while the table view sorts via its headers and the chart
            view has no meaningful sort. */}
        {currentViewMode === "list" && isPopulatedArray(sortableFields) && (
          <SortControl
            fields={sortableFields}
            sort={viewSettings.sort}
            onSortChange={(sort) => updateViewSettings({ sort })}
          />
        )}

        {/* Table-only controls are hidden while the chart breakdown is active */}
        {!chartMode && isPopulatedArray(groupableColumns) && (
          <GroupByButton
            columns={groupableColumns}
            onGroupByChange={(groupByKey) => debouncedUpdate({ groupByKey })}
          />
        )}

        <ViewModeToggle
          value={currentViewMode}
          options={viewModeOptions}
          onChange={handleViewModeChange}
        />

        {onCreateClick && (
          <>
            <Separator orientation="vertical" />
            <Button variant="default" onClick={onCreateClick}>
              <Plus />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export const CrudDataTableHeader = fixedForwardRef(
  CrudDataTableHeaderComponent
);
