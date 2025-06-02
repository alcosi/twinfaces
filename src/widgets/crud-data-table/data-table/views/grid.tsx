import { flexRender, useReactTable } from "@tanstack/react-table";
import { Row } from "@tanstack/table-core";
import { ChevronDown, ChevronRight } from "lucide-react";
import React from "react";

import { cn, isPopulatedArray } from "@/shared/libs";
import {
  Table,
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
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  onRowClick?: (row: TData) => void;
}) {
  // Render a single, non-grouped row
  function renderRow(row: Row<TData>) {
    return (
      <TableRow
        role={onRowClick ? "button" : undefined}
        key={row.id}
        data-state={row.getIsSelected() ? "selected" : undefined}
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
    return table
      .getRowModel()
      .rows.map((row) =>
        isPopulatedArray(row.subRows) ? (
          renderExpandableRows(row)
        ) : (
          <React.Fragment key={row.id}>{renderRow(row)}</React.Fragment>
        )
      );
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {!header.isPlaceholder &&
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>{renderTableBodyRows()}</TableBody>
    </Table>
  );
}
