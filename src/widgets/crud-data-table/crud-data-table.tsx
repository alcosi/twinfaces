"use client";

// TODO: Refactor CrudDataTableHeader to Decouple Modal from Create Action
// Jira: https://alcosi.atlassian.net/browse/TWINFACES-593
// This component currently forces the use of a modal for the "create" flow.
// It should be refactored to allow consumers to define custom create behavior
// (e.g., opening a modal, navigating to a page, showing a drawer, etc.).
import { PaginationState } from "@tanstack/table-core";
import { usePathname, useRouter } from "next/navigation";
import {
  ForwardedRef,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { UseFormReturn } from "react-hook-form";

import { PagedResponse, SortV1 } from "@/shared/api";
import {
  cn,
  fixedForwardRef,
  isPopulatedArray,
  usePermissionsAccess,
} from "@/shared/libs";

import {
  ChartGrouping,
  GroupableField,
  TableChartView,
  buildChartData,
} from "./chart-view";
import { CHART_FETCH_LIMIT, DEFAULT_PAGE_SIZES } from "./constans";
import {
  DataTable,
  DataTableHandle,
  DataTableProps,
  DataTableRow,
} from "./data-table";
import { CrudDataTableDialog, CrudDataTableDialogRef } from "./dialog";
import {
  CrudDataTableHeader,
  CrudDataTableHeaderProps,
  TableViewState,
} from "./header";
import { ColumnManagerPopover } from "./header/column-manger-popover";
import { getColumnKey, getColumnLabel, groupDataByKey } from "./helpers";
import { useViewSettings } from "./hooks";

/** Active query/filters/sort, forwarded to server-side chart grouping builders. */
export type ChartDataContext = {
  search?: string;
  filters: Record<string, unknown>;
  sort?: SortV1;
};

type CrudDataTableProps<
  TData extends DataTableRow<TData>,
  TValue,
> = CrudDataTableHeaderProps &
  Omit<DataTableProps<TData, TValue>, "fetcher" | "getRowId"> & {
    className?: string;
    defaultVisibleColumns?: DataTableProps<TData, TValue>["columns"];
    orderedColumns?: DataTableProps<TData, TValue>["columns"];
    groupableColumns?: DataTableProps<TData, TValue>["columns"];
    /**
     * Client-side pie-chart breakdown: fields are grouped over the fetched
     * dataset. Enables the chart toggle.
     */
    groupableFields?: GroupableField<TData>[];
    /**
     * Server-side pie-chart breakdown: builds groupings from the active
     * filters (e.g. via a dedicated "count" endpoint). Enables the chart
     * toggle. Takes precedence over `groupableFields` when provided.
     */
    chartGroupings?: (context: ChartDataContext) => ChartGrouping[];
    dialogForm?: UseFormReturn<any>;
    onCreateSubmit?: (values: any) => Promise<void>;
    renderFormFields?: () => ReactNode;
    // === Overridden ===
    fetcher: (
      pagination: PaginationState,
      filters: { search?: string; filters: { [key: string]: any } },
      sort?: SortV1
    ) => Promise<PagedResponse<TData>>;
    getRowId: (row: TData) => string;
    modalTitle?: string;
    submitButtonLabel?: string;
  };

export const CrudDataTable = fixedForwardRef(CrudDataTableInternal);

function CrudDataTableInternal<TData extends DataTableRow<TData>, TValue>(
  {
    className,
    fetcher,
    dialogForm,
    onCreateSubmit,
    renderFormFields,
    onRowClick,
    pageSizes = DEFAULT_PAGE_SIZES,
    ...props
  }: CrudDataTableProps<TData, TValue>,
  ref: ForwardedRef<DataTableHandle>
) {
  const router = useRouter();
  const pathname = usePathname();
  const { canForCurrentRoute } = usePermissionsAccess();
  const canCreate = canForCurrentRoute("CREATE");

  const { viewSettings, updateViewSettings } = useViewSettings(
    props.defaultVisibleColumns,
    props.orderedColumns,
    props.columns
  );

  // Stable identity: the header pushes its state through this on every change,
  // and it is a dependency of the header's effect — an inline function here
  // would retrigger that effect every render and loop indefinitely.
  const handleHeaderViewSettingsChange = useCallback(
    (settings: TableViewState) =>
      // Column visibility/order is owned here (driven by the column manager in
      // the actions header), so only adopt the header-owned fields and never
      // let the header overwrite the column selection.
      updateViewSettings({
        query: settings.query,
        filters: settings.filters,
        groupByKey: settings.groupByKey,
        layoutMode: settings.layoutMode,
        sort: settings.sort,
      }),
    [updateViewSettings]
  );

  const tableRef = useRef<DataTableHandle>(null);
  const dialogRef = useRef<CrudDataTableDialogRef>(null);
  const isFirstViewSettingsSync = useRef(true);
  const isFirstGroupBySync = useRef(true);
  const isFirstSortSync = useRef(true);

  const [chartMode, setChartMode] = useState(false);
  const [chartRefreshSignal, setChartRefreshSignal] = useState(0);

  // Loads the full filtered dataset once and shares the in-flight promise
  // across all client-side groupings. A fresh cache is created whenever the
  // active query/filters/sort (or a manual refresh) change.
  const loadRowsOnce = useMemo(() => {
    let promise: Promise<TData[]> | null = null;
    return () => {
      if (!promise) {
        promise = fetcher(
          { pageIndex: 0, pageSize: CHART_FETCH_LIMIT },
          { search: viewSettings.query, filters: viewSettings.filters },
          viewSettings.sort
        ).then((response) => response.data);
      }
      return promise;
    };
  }, [
    fetcher,
    viewSettings.query,
    viewSettings.filters,
    viewSettings.sort,
    chartRefreshSignal,
  ]);

  // Unify the two breakdown modes into a single list of chart groupings.
  const chartGroupings = useMemo<ChartGrouping[]>(() => {
    if (props.chartGroupings) {
      return props.chartGroupings({
        search: viewSettings.query,
        filters: viewSettings.filters,
        sort: viewSettings.sort,
      });
    }

    if (isPopulatedArray(props.groupableFields)) {
      return props.groupableFields.map((field) => ({
        key: field.key,
        label: field.label,
        load: async () => buildChartData(await loadRowsOnce(), field),
      }));
    }

    return [];
  }, [
    props.chartGroupings,
    props.groupableFields,
    loadRowsOnce,
    viewSettings.query,
    viewSettings.filters,
    viewSettings.sort,
  ]);

  const hasChartView = isPopulatedArray(chartGroupings);

  useImperativeHandle(ref, () => tableRef.current!, [tableRef]);

  useEffect(() => {
    if (isFirstViewSettingsSync.current) {
      isFirstViewSettingsSync.current = false;
      return;
    }

    tableRef.current?.resetPage();
  }, [viewSettings.query, viewSettings.filters]);

  useEffect(() => {
    if (isFirstGroupBySync.current) {
      isFirstGroupBySync.current = false;
      return;
    }

    tableRef.current?.refresh();
  }, [viewSettings.groupByKey]);

  useEffect(() => {
    if (isFirstSortSync.current) {
      isFirstSortSync.current = false;
      return;
    }

    tableRef.current?.resetPage();
  }, [viewSettings.sort]);

  const fetchWrapper = async (pagination: PaginationState) => {
    try {
      const response = await fetcher(
        pagination,
        {
          search: viewSettings.query,
          filters: viewSettings.filters,
        },
        viewSettings.sort
      );

      if (viewSettings.groupByKey) {
        response.data = groupDataByKey(response.data, viewSettings.groupByKey);
      }

      return response;
    } catch (error) {
      console.error("Error in fetchWrapper:", error);
      throw error;
    }
  };

  // The actions column is handled separately from the data ("content")
  // columns: it always sits last (sticky), it is never user-hidden, and it
  // hosts the Jira-style column-visibility control in its header.
  const contentColumns = useMemo(
    () => props.columns.filter((col) => col.id !== "actions"),
    [props.columns]
  );

  const actionsColumn = useMemo(
    () => props.columns.find((col) => col.id === "actions"),
    [props.columns]
  );

  // The column manager is offered whenever the table opts into configurable
  // columns. It is independent of permissions — it only toggles visibility.
  const hasColumnManager = isPopulatedArray(props.defaultVisibleColumns);

  const columnManager = useMemo(() => {
    if (!hasColumnManager) return undefined;

    return (
      <ColumnManagerPopover
        columns={contentColumns
          .map((column) => ({
            id: getColumnKey(column),
            name: getColumnLabel(column),
            visible: viewSettings.visibleKeys.includes(getColumnKey(column)),
          }))
          .sort(
            (a, b) =>
              viewSettings.orderKeys.indexOf(a.id) -
              viewSettings.orderKeys.indexOf(b.id)
          )}
        sortKeys={viewSettings.orderKeys}
        onVisibleChange={(visibleKeys) => updateViewSettings({ visibleKeys })}
        onSortChange={(orderKeys) => updateViewSettings({ orderKeys })}
        onReset={() =>
          updateViewSettings({
            visibleKeys: props.defaultVisibleColumns!.map(getColumnKey),
          })
        }
      />
    );
  }, [
    hasColumnManager,
    contentColumns,
    viewSettings.visibleKeys,
    viewSettings.orderKeys,
    props.defaultVisibleColumns,
    updateViewSettings,
  ]);

  // Keep the actions column when it carries an action menu the user may use,
  // or when it needs to host the column manager. The menu cell itself is
  // permission-gated (rendered empty without CREATE), while the header (and
  // thus the column manager) is always shown.
  const enhancedActionsColumn = useMemo(() => {
    const needsActionsColumn =
      hasColumnManager || (Boolean(actionsColumn) && canCreate);
    if (!needsActionsColumn) return undefined;

    const base = actionsColumn ?? { id: "actions", header: "" };
    return {
      ...base,
      id: "actions",
      cell: canCreate && actionsColumn?.cell ? actionsColumn.cell : () => null,
    } as (typeof props.columns)[number];
  }, [hasColumnManager, actionsColumn, canCreate]);

  const visibleColumns = useMemo(() => {
    const visibleContentColumns = isPopulatedArray(props.defaultVisibleColumns)
      ? contentColumns
          .filter((column) =>
            viewSettings.visibleKeys.includes(getColumnKey(column))
          )
          .sort(
            (a, b) =>
              viewSettings.orderKeys.indexOf(getColumnKey(a)) -
              viewSettings.orderKeys.indexOf(getColumnKey(b))
          )
      : contentColumns;

    return enhancedActionsColumn
      ? [...visibleContentColumns, enhancedActionsColumn]
      : visibleContentColumns;
  }, [
    viewSettings.visibleKeys,
    viewSettings.orderKeys,
    contentColumns,
    enhancedActionsColumn,
    props.defaultVisibleColumns,
  ]);

  const handleOnCreateClick =
    onCreateSubmit && canCreate ? () => dialogRef.current?.open() : undefined;

  function handleOnRowClick(row: TData) {
    if (onRowClick) {
      return onRowClick(row);
    }

    const rowId = props.getRowId(row);
    const basePath = pathname.replace(/\/$/, "");

    router.push(`${basePath}/${rowId}`);
  }

  return (
    <div className={cn("flex-1 py-4", className)}>
      <CrudDataTableHeader
        ref={tableRef}
        title={props.title}
        search={props.search}
        hideRefresh={props.hideRefresh}
        columns={props.columns}
        defaultVisibleColumns={props.defaultVisibleColumns}
        orderedColumns={props.orderedColumns}
        groupableColumns={props.groupableColumns}
        filters={props.filters}
        chartViewEnabled={hasChartView}
        chartMode={chartMode}
        onChartModeChange={setChartMode}
        onChartRefresh={() => setChartRefreshSignal((prev) => prev + 1)}
        onCreateClick={handleOnCreateClick}
        onViewSettingsChange={handleHeaderViewSettingsChange}
      />

      {chartMode && hasChartView ? (
        <TableChartView
          groupings={chartGroupings}
          refreshSignal={chartRefreshSignal}
        />
      ) : (
        <DataTable
          ref={tableRef}
          {...props}
          columns={visibleColumns}
          fetcher={fetchWrapper}
          pageSizes={pageSizes}
          onRowClick={handleOnRowClick}
          layoutMode={viewSettings.layoutMode}
          sort={viewSettings.sort}
          onSortChange={(s) => updateViewSettings({ sort: s })}
          columnManager={columnManager}
        />
      )}

      <CrudDataTableDialog
        ref={dialogRef}
        dialogForm={dialogForm}
        renderFormFields={renderFormFields}
        onCreateSubmit={onCreateSubmit}
        onSubmitSuccess={() => tableRef.current?.refresh()}
        title={props.modalTitle}
        submitButtonLabel={props.submitButtonLabel}
      />
    </div>
  );
}
