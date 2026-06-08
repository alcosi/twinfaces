import { flexRender, useReactTable } from "@tanstack/react-table";
import { Row } from "@tanstack/table-core";
import { ChevronDown, ChevronRight } from "lucide-react";
import React, { ReactNode } from "react";

import { cn, isEmptyArray, isPopulatedArray } from "@/shared/libs";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

import { DataTableRow } from "../types";

/**
 * Renders a horizontal table with expandable rows.
 */
export function DataTableGrid<TData extends DataTableRow<TData>>({
  table,
  onRowClick,
  columnManager,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  onRowClick?: (row: TData) => void;
  columnManager?: ReactNode;
}) {
  function getStickyActionsClass(columnId: string, type: "head" | "cell") {
    if (columnId !== "actions") return undefined;

    return cn(
      // Fixed-width, right-pinned column. The header is also pinned to the top
      // (`top-0`) so it stays a sticky top-right corner. The header cell sits
      // at z-30 (above the z-20 <thead>), while body action cells stay at z-10
      // — below the header row so table content can't scroll over the
      // column-manager control, but above the non-sticky body cells.
      "sticky right-0 w-14 min-w-14 max-w-14 bg-background",
      type === "head" ? "top-0 z-30" : "z-10"
    );
  }

  // Render a single, non-grouped row
  function renderRow(row: Row<TData>) {
    return (
      <TableRow
        role={onRowClick ? "button" : undefined}
        key={row.id}
        data-state={row.getIsSelected() ? "selected" : undefined}
        onClick={() => onRowClick?.(row.original)}
        className={cn(onRowClick && "cursor-pointer", "group")}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className={cn(
              getStickyActionsClass(cell.column.id, "cell"),
              // The sticky actions cell keeps an opaque base so scrolled
              // content can't show through it. The row-hover tint is layered
              // via an overlay (instead of a semi-transparent cell bg) so it
              // doesn't double up over the row's own hover background and the
              // column stays seamless with the rest of the row.
              cell.column.id === "actions" &&
                onRowClick &&
                "before:bg-muted/50 before:pointer-events-none before:absolute before:inset-0 before:opacity-0 group-hover:before:opacity-100"
            )}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  // Render a “group” header row, plus its child if expanded
  function renderExpandableRows(row: Row<TData>) {
    const groupByCell = row.getVisibleCells().find((c) => c.getValue());
    return (
      <React.Fragment key={row.id}>
        <TableRow
          data-state={row.getIsSelected() ? "selected" : undefined}
          onClick={() => onRowClick?.(row.original)}
          className={cn(onRowClick && "cursor-pointer", "bg-accent")}
        >
          <TableCell colSpan={row.getVisibleCells().length}>
            <div className="inline-flex items-center font-semibold">
              <button
                className="pointer me-2"
                onClick={row.getToggleExpandedHandler()}
              >
                {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
              </button>
              {groupByCell &&
                flexRender(
                  groupByCell.column.columnDef.cell,
                  groupByCell.getContext()
                )}
            </div>
          </TableCell>
        </TableRow>

        {row.getParentRow()?.getIsExpanded() ? renderRow(row) : null}
      </React.Fragment>
    );
  }

  // Builds the full list of <TableRow> (including expandable or normal)
  function renderTableBodyRows() {
    const rows = table.getRowModel().rows;

    if (isEmptyArray(rows)) {
      return (
        <TableRow>
          <TableCell
            colSpan={table.getVisibleLeafColumns().length}
            className="text-muted-foreground h-24 text-center"
          >
            No results.
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((row) =>
      isPopulatedArray(row.subRows) ? (
        renderExpandableRows(row)
      ) : (
        <React.Fragment key={row.id}>{renderRow(row)}</React.Fragment>
      )
    );
  }

  return (
    <table className="w-full caption-bottom text-sm">
      <TableHeader className="[&_tr]:bg-background sticky top-0 z-20">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              const isActions = header.column.id === "actions";

              return (
                <TableHead
                  key={header.id}
                  className={getStickyActionsClass(header.column.id, "head")}
                >
                  {isActions && columnManager ? (
                    // Jira-style: the actions column header hosts the
                    // column-visibility control instead of a text label.
                    <div className="flex justify-end">{columnManager}</div>
                  ) : (
                    !header.isPlaceholder &&
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>{renderTableBodyRows()}</TableBody>
    </table>
  );
}
