import { flexRender, useReactTable } from "@tanstack/react-table";
import { Row } from "@tanstack/table-core";
import { ChevronDown, ChevronRight, DotSquare } from "lucide-react";
import React, { useState } from "react";

import { cn, isPopulatedArray } from "@/shared/libs";
import {
  Button,
  DotsIcon,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
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
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // Render a single, non-grouped row
  function renderRow(row: Row<TData>) {
    return (
      <TableRow
        role={onRowClick ? "button" : undefined}
        key={row.id}
        data-state={row.getIsSelected() ? "selected" : undefined}
        onClick={() => {
          onRowClick?.(row.original);
          setSelectedRowId(row.id);
        }}
        className={cn(onRowClick && "cursor-pointer")}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}

        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="group focus-visible:ring-ons-orange-500 rounded p-1 hover:bg-transparent focus:outline-none focus-visible:ring-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRowId(row.id);
                }}
              >
                <DotsIcon className="group-hover:text-ons-blue-700 group-focus-visible:text-ons-blue-500" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="rounded-[10px] border border-[#F1F4F9] bg-white shadow-[0_1px_6px_rgba(51,76,235,0.1)]"
            >
              <DropdownMenuItem className="leading-[1.3] font-normal text-[#0D114E]">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="leading-[1.3] font-normal text-[#0D114E]">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
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
          onClick={() => {
            onRowClick?.(row.original);
            setSelectedRowId(row.id);
          }}
          className={cn(onRowClick && "cursor-pointer", "bg-accent")}
        >
          <TableCell colSpan={row.getVisibleCells().length + 1}>
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
