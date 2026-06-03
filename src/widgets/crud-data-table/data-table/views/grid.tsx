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
      "sticky right-0 border-l border-border bg-background",
      type === "head" ? "z-30" : "z-20"
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
              cell.column.id === "actions" &&
                onRowClick &&
                "group-hover:bg-muted/50"
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
      <TableHeader className="[&_tr]:bg-background sticky top-0 z-10">
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
