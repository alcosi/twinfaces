"use client";

import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  PaginationState,
  getExpandedRowModel,
  isFunction,
} from "@tanstack/table-core";
import {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { TableSkeleton } from "@/features/ui/skeletons";
import { PaginationV1 } from "@/shared/api";
import {
  cn,
  fixedForwardRef,
  isEmptyArray,
  isPopulatedArray,
} from "@/shared/libs";

import { DataTablePagination } from "./data-table-pagination";
import { SortProvider } from "./sort-context";
import { DataTableHandle, DataTableProps, DataTableRow } from "./types";
import { DataTableGrid, DataTableList } from "./views";

export const DataTable = fixedForwardRef(DataTableInternal);

function DataTableInternal<TData extends DataTableRow<TData>, TValue>(
  {
    columns,
    getRowId,
    fetcher,
    disablePagination,
    pageSizes = [10, 25, 50],
    onFetchError,
    onRowClick,
    layoutMode = "grid",
    sort,
    onSortChange,
    columnManager,
    renderListItem,
  }: DataTableProps<TData, TValue>,
  ref: ForwardedRef<DataTableHandle>
) {
  const [data, setData] = useState<TData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    tanstask: PaginationState;
    api: PaginationV1;
  }>({
    tanstask: {
      pageIndex: 0,
      pageSize: pageSizes[0]!,
    },
    api: {
      offset: 0,
      limit: 0,
      total: 0,
    },
  });

  const pageCount = useMemo(() => {
    if (!pagination.api?.limit || !pagination.api?.total) return 0;
    return Math.ceil(pagination.api.total / pagination.api.limit);
  }, [pagination.api]);

  const table = useReactTable<TData>({
    data,
    columns,
    getRowId: getRowId,
    enableRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pageCount,
    state: {
      pagination: pagination.tanstask,
    },
    onPaginationChange: (updater) => {
      const nextState = isFunction(updater)
        ? updater(pagination.tanstask)
        : updater;
      setPagination({
        api: pagination.api,
        tanstask: nextState,
      });
    },
    // NOTE: Options for ExpandableRows
    getSubRows: (row) => row.subRows || [],
    getRowCanExpand: (row) => isPopulatedArray(row.subRows),
    getExpandedRowModel: getExpandedRowModel(),
  });

  useImperativeHandle(ref, () => {
    return {
      resetPage() {
        setPagination((prev) => ({
          ...prev,
          tanstask: {
            ...prev.tanstask,
            pageIndex: 0,
          },
        }));
      },

      refresh() {
        fetchData();
      },
    };
  });

  function fetchData() {
    setLoading(true);
    fetcher(pagination.tanstask)
      .then(({ data, pagination }) => {
        setData(data);
        setPagination((prev) => ({
          tanstask: prev.tanstask,
          api: pagination ?? prev.api,
        }));
      })
      .catch((error) => {
        onFetchError?.(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    table.toggleAllRowsExpanded();
  }, [table.toggleAllRowsExpanded]);

  useEffect(() => {
    fetchData();
  }, [pagination.tanstask]);

  if (loading) {
    return <TableSkeleton hideHeader />;
  }

  return (
    <SortProvider sort={sort} onSortChange={onSortChange ?? (() => {})}>
      <div
        className={cn(
          // Sizes to its content (so few rows stay compact) but never grows;
          // `min-h-0` + the default flex-shrink let it cap to the available
          // height and scroll on its own when rows overflow, keeping the page
          // from double-scrolling and the pagination footer below pinned.
          // `isolate` contains the table's sticky header/actions z-index stack
          // so it can't paint over the page breadcrumb/tabs headers.
          "force-scrollbar-x relative isolate mb-2 min-h-0 flex-initial overflow-auto",
          layoutMode === "grid" && "border-border rounded-md border"
        )}
      >
        {layoutMode === "grid" ? (
          // Grid keeps its header (and the column-manager control) mounted even
          // when there are no rows, so column visibility stays configurable.
          <DataTableGrid
            table={table}
            onRowClick={onRowClick}
            columnManager={columnManager}
          />
        ) : isEmptyArray(table.getRowModel().rows) ? (
          <div className="text-muted-foreground rounded-md p-4 text-center">
            No results.
          </div>
        ) : (
          <DataTableList
            table={table}
            onRowClick={onRowClick}
            renderItem={renderListItem}
          />
        )}
      </div>
      {!disablePagination && (
        <div className="shrink-0">
          <DataTablePagination
            table={table}
            pageSizes={pageSizes}
            pageState={pagination.api}
          />
        </div>
      )}
    </SortProvider>
  );
}
