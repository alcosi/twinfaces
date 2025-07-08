import { Table } from "@tanstack/react-table";
import {
  AlignJustify,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Files,
  Layers3,
} from "lucide-react";
import { useEffect, useState } from "react";

import { PaginationV1 } from "@/shared/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { Button } from "@/shared/ui/button";

type DataTablePaginationState = {
  pageIndex: number;
  rangeStart: number;
  rangeEnd: number;
};

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizes: number[];
  pageState: PaginationV1;
}

export function DataTablePagination<TData>({
  table,
  pageSizes,
  pageState: { offset = 0, limit = 0, total = 0 },
}: DataTablePaginationProps<TData>) {
  const [state, setState] = useState<DataTablePaginationState>({
    pageIndex: 0,
    rangeStart: 0,
    rangeEnd: 0,
  });

  useEffect(() => {
    const pageIndex = limit === 0 ? 0 : Math.floor(offset / limit) + 1;
    const rangeStart = total === 0 ? 0 : (pageIndex - 1) * limit + 1;
    const rangeEnd = limit === 0 ? 0 : Math.min(rangeStart + limit - 1, total);

    setState({ pageIndex, rangeStart, rangeEnd });
  }, [offset, limit, total]);

  return (
    <div className="flex items-center justify-between px-2">
      {table.options.enableRowSelection && (
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of {total} row(s)
          selected.
        </div>
      )}

      <div className="flex w-full items-center justify-end space-x-6 lg:space-x-8">
        <div className="flex items-center justify-center space-x-2 text-sm font-medium">
          <AlignJustify className="stroke-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground">
            {state.rangeStart} - {state.rangeEnd} of {total}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Layers3 className="stroke-muted-foreground h-4 w-4" />
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="text-muted-foreground h-8 w-[70px]">
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizes.map((pageSize) => (
                <SelectItem
                  className="text-muted-foreground"
                  key={pageSize}
                  value={`${pageSize}`}
                >
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Files className="stroke-muted-foreground h-4 w-4" />
          <span className="text-muted-foreground">
            {state.pageIndex} of {table.getPageCount()}
          </span>

          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft className="stroke-muted-foreground h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft className="stroke-muted-foreground h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight className="stroke-muted-foreground h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight className="stroke-muted-foreground h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
