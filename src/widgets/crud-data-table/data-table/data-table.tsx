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
  useTraceUpdate,
} from "@/shared/libs";

import { DataTablePagination } from "./data-table-pagination";
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

      // Only update state if pagination has truly changed
      if (
        nextState.pageIndex !== pagination.tanstask.pageIndex ||
        nextState.pageSize !== pagination.tanstask.pageSize
      ) {
        setPagination({
          api: pagination.api,
          tanstask: nextState,
        });
      }
    },
    // NOTE: Options for ExpandableRows
    getSubRows: (row) => row.subRows || [],
    getRowCanExpand: (row) => isPopulatedArray(row.subRows),
    getExpandedRowModel: getExpandedRowModel(),
  });

  useImperativeHandle(ref, () => {
    return {
      resetPage() {
        table.firstPage();
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
  }, []);

  useEffect(() => {
    console.log("DataTable fetchData called+++++++++++++++");
    fetchData();
  }, [pagination.tanstask.pageIndex, pagination.tanstask.pageSize]);

  useTraceUpdate({
    props: {
      columns,
      getRowId,
      fetcher,
      disablePagination,
      pageSizes,
      onFetchError,
      onRowClick,
      layoutMode,
    },
    componentName: "DataTable",
  });

  if (loading) {
    return <TableSkeleton withHeader={false} />;
  }

  return (
    <>
      <div
        className={cn(
          "relative mb-2",
          layoutMode === "grid" && "border-border rounded-md border"
        )}
      >
        {isEmptyArray(table.getRowModel().rows) ? (
          <div className="text-muted-foreground rounded-md p-4 text-center">
            No results.
          </div>
        ) : layoutMode === "grid" ? (
          <DataTableGrid table={table} onRowClick={onRowClick} />
        ) : (
          <DataTableList table={table} onRowClick={onRowClick} />
        )}
      </div>
      {!disablePagination && (
        <DataTablePagination
          table={table}
          pageSizes={pageSizes}
          pageState={pagination.api}
        />
      )}
    </>
  );
}
