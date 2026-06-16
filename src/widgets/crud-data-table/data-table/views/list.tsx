import { flexRender, useReactTable } from "@tanstack/react-table";
import { ReactNode } from "react";

import { cn } from "@/shared/libs";
import { Card } from "@/shared/ui";

import { DataTableRow } from "../types";

/**
 * Renders each row as a card list (no table markup).
 *
 * When `renderItem` is supplied the row is rendered with that bespoke card
 * instead of the generic column-derived definition list — letting a consumer
 * (e.g. the comments view) keep its own card design while still reusing the
 * shared toolbar, sorting, paging and pie-chart view. A bespoke card owns its
 * own interactions, so the row-level `onRowClick` is intentionally not applied
 * in this mode.
 */
export function DataTableList<TData extends DataTableRow<TData>>({
  table,
  onRowClick,
  renderItem,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  onRowClick?: (row: TData) => void;
  renderItem?: (row: TData) => ReactNode;
}) {
  if (renderItem) {
    return (
      <div className="flex flex-col gap-4">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id}>{renderItem(row.original)}</div>
        ))}
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
      {table.getRowModel().rows.map((row) => (
        <Card
          key={row.id}
          onClick={() => onRowClick?.(row.original)}
          className={cn(
            "border-muted bg-background overflow-hidden rounded-md border px-2 py-1",
            onRowClick && "hover:bg-primary-foreground cursor-pointer"
          )}
        >
          <dl>
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
        </Card>
      ))}
    </div>
  );
}
