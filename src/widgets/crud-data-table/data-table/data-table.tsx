"use client";

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
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  getExpandedRowModel,
  isFunction,
  PaginationState,
  Row,
} from "@tanstack/table-core";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
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

  return (
    <div>
      <div className="relative rounded-md border mb-2">
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
