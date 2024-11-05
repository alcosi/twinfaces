"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "@/components/base/data-table/data-table-pagination";
import { LoadingOverlay } from "@/components/base/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/base/table";
import { cn, fixedForwardRef } from "@/shared/libs";
import {
  getExpandedRowModel,
  PaginationState,
  Row,
} from "@tanstack/table-core";
import React, {
  ForwardedRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Identifiable, isPopulatedArray } from "@/shared/libs";

export type DataTableHandle = {
  refresh: () => void;
  resetPage: () => void;
  // getFilterValues: () => PaginatedTableFilterValues | undefined;
  // setFilterValues: (values?: PaginatedTableFilterValues) => any;
};

export interface DataTableRow<TData> extends Identifiable {
  subRows?: TData[];
}

export interface DataTableProps<TData extends DataTableRow<TData>, TValue> {
  columns: ColumnDef<TData, TValue>[];
  getRowId: (row: TData, index: number) => string;
  fetcher: (
    pagination: PaginationState
  ) => Promise<{ data: TData[]; pageCount: number }>;
  disablePagination?: boolean;
  pageSizes?: number[];
  onFetchError?: (e: Error) => any;
  onRowClick?: (row: TData) => any;
}

export const DataTable = fixedForwardRef(DataTableInternal);

function DataTableInternal<TData extends DataTableRow<TData>, TValue>(
  {
    columns,
    getRowId,
    fetcher,
    disablePagination,
    pageSizes,
    onFetchError,
    onRowClick,
  }: DataTableProps<TData, TValue>,
  ref: ForwardedRef<DataTableHandle>
) {
  const [data, setData] = useState<TData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: pageSizes?.[0] ?? 10,
  });
  const [pageCount, setPageCount] = useState<number>(0);

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
      pagination: pagination,
    },
    onPaginationChange: (updater) => {
      const nextState =
        typeof updater === "function" ? updater(pagination) : updater;
      setPagination(nextState);
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
    fetcher(pagination)
      .then(({ data, pageCount }) => {
        setData(data);
        setPageCount(pageCount);
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
  }, [pagination]);

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
    const mainCell = row.getVisibleCells()[0];
    return (
      <>
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          onClick={() => onRowClick?.(row.original)}
          className={cn(onRowClick && "cursor-pointer")}
        >
          <TableCell colSpan={row.getVisibleCells().length} key={mainCell?.id}>
            {mainCell &&
              flexRender(
                mainCell?.column.columnDef.cell,
                mainCell?.getContext()
              )}
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
        <DataTablePagination table={table} pageSizes={pageSizes} />
      )}
    </div>
  );
}
