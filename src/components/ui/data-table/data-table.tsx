"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel, getPaginationRowModel, Updater,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {PaginationState} from "@tanstack/table-core";
import {ForwardedRef, useEffect, useImperativeHandle, useState} from "react";
import {DataTablePagination} from "@/components/ui/data-table/data-table-pagination";
import {cn, fixedForwardRef} from "@/lib/utils";
import {LoadingOverlay, LoadingSpinner} from "@/components/ui/loading";

export type DataTableHandle = {
    refresh: () => void;
    resetPage: () => void;
    // getFilterValues: () => PaginatedTableFilterValues | undefined;
    // setFilterValues: (values?: PaginatedTableFilterValues) => any;
};

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    fetcher: (pagination: PaginationState) => Promise<{ data: TData[], pageCount: number }>
    pageSizes?: number[],
    onFetchError?: (e: Error) => any;
    onRowClick?: (row: TData) => any;
}

export const DataTable = fixedForwardRef(DataTableInternal);

export function DataTableInternal<TData, TValue>({
                                                     columns,
                                                     fetcher,
                                                     pageSizes,
                                                     onFetchError,
                                                     onRowClick
                                                 }: DataTableProps<TData, TValue>,
                                                 ref: ForwardedRef<DataTableHandle>) {
    const [data, setData] = useState<TData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationState>({pageIndex: 0, pageSize: pageSizes?.[0] ?? 10});
    const [pageCount, setPageCount] = useState<number>(0);

    const table = useReactTable({
        data,
        columns,
        enableRowSelection: false,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        pageCount: pageCount,
        state: {
            pagination: pagination
        },
        onPaginationChange: (updater) => {
            const nextState = typeof updater === 'function' ? updater(pagination) : updater;
            setPagination(nextState)
        },
    })

    useImperativeHandle(ref, () => {
        return {
            resetPage() {
                table.firstPage();
            },

            refresh() {
                fetchData();
            },
        }
    });

    function fetchData() {
        setLoading(true);
        fetcher(pagination).then(({data, pageCount}) => {
            setData(data);
            setPageCount(pageCount);
        }).catch((error) => {
            onFetchError?.(error);
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchData();
    }, [pagination]);

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
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onRowClick?.(row.original)}
                                    className={cn(onRowClick != null && "cursor-pointer")}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                {loading && <LoadingOverlay/>}
            </div>
            <DataTablePagination table={table} pageSizes={pageSizes}/>
        </div>
    )
}
