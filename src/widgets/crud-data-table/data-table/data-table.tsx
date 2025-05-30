"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  PaginationState,
  Row,
  getExpandedRowModel,
  isFunction,
} from "@tanstack/table-core";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { PaginationV1 } from "@/shared/api";
import { cn, fixedForwardRef, isPopulatedArray } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableHandle, DataTableProps, DataTableRow } from "./types";

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
  }, [table.toggleAllRowsExpanded]);

  useEffect(() => {
    fetchData();
  }, [pagination.tanstask]);

  function renderRow(row: Row<TData>) {
    return (
      <TableRow
        role={onRowClick && "button"}
        key={row.id}
        data-state={row.getIsSelected() && "selected"}
        onClick={() => onRowClick?.(row.original)}
        className={cn(onRowClick && "cursor-pointer")}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  function renderExpandableRows(row: Row<TData>) {
    const groupByCell = row.getVisibleCells().find((c) => c.getValue());
    return (
      <>
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          onClick={() => onRowClick?.(row.original)}
          className={cn(onRowClick && "cursor-pointer", "bg-accent")}
        >
          <TableCell
            colSpan={row.getVisibleCells().length}
            key={groupByCell?.id}
          >
            <div className="inline-flex items-center font-semibold">
              <button
                className="pointer me-2"
                onClick={row.getToggleExpandedHandler()}
              >
                {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
              </button>
              {groupByCell &&
                flexRender(
                  groupByCell?.column.columnDef.cell,
                  groupByCell?.getContext()
                )}
            </div>
          </TableCell>
        </TableRow>

        {row.getParentRow()?.getIsExpanded() && renderRow(row)}
      </>
    );
  }

  const renderTableBodyRows = () => {
    if (!table.getRowModel().rows?.length) {
      return (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      );
    }

    return table
      .getRowModel()
      .rows.map((row) => (
        <React.Fragment key={row.id}>
          {isPopulatedArray(row.subRows)
            ? renderExpandableRows(row)
            : renderRow(row)}
        </React.Fragment>
      ));
  };

  function renderHorizontalRows() {
    return (
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>{renderTableBodyRows()}</TableBody>
      </Table>
    );
  }

  function renderVerticalRows() {
    if (!table.getRowModel().rows?.length) {
      return (
        <div className="text-muted-foreground rounded-md p-4 text-center">
          No results.
        </div>
      );
    }

    const visibleColumns = table.getVisibleLeafColumns();
    const headersMap = new Map(
      table
        .getHeaderGroups()
        .flatMap((group) => group.headers)
        .map((header) => [header.column.id, header])
    );

    return (
      <div className="flex flex-col gap-4">
        {table.getRowModel().rows.map((row, index) => (
          <div
            key={row.id}
            onClick={() => onRowClick?.(row.original)}
            className={cn(
              "border-muted relative overflow-hidden rounded-md border p-4",
              index % 2 === 0 ? "bg-background" : "bg-primary-foreground",
              onRowClick && "group cursor-pointer"
            )}
          >
            {onRowClick && (
              <div
                className="group-hover:bg-accent/30 pointer-events-none absolute inset-0 z-0 transition-colors duration-150"
                aria-hidden="true"
              />
            )}

            <dl className="relative z-10 grid grid-cols-1">
              {visibleColumns.map((column, index) => {
                const cell = row
                  .getAllCells()
                  .find((c) => c.column.id === column.id);
                const header = headersMap.get(column.id);

                return (
                  <div
                    key={column.id}
                    className={cn(
                      "flex items-start gap-2 py-2",
                      index !== 0 && "border-muted border-t"
                    )}
                  >
                    <dt className="text-muted-foreground min-w-[120px] text-sm font-medium">
                      {header
                        ? flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        : column.id}
                    </dt>
                    <dd className="text-sm font-normal">
                      {cell &&
                        flexRender(column.columnDef.cell, cell.getContext())}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "relative mb-2",
          layoutMode === "grid" && "border-border rounded-md border"
        )}
      >
        {layoutMode === "grid" ? renderHorizontalRows() : renderVerticalRows()}
        {loading && <LoadingOverlay />}
      </div>
      {!disablePagination && (
        <DataTablePagination
          table={table}
          pageSizes={pageSizes}
          pageState={pagination.api}
        />
      )}
    </div>
  );
}
