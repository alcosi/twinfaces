import { flexRender, useReactTable } from "@tanstack/react-table";

import { cn } from "@/shared/libs";
import { Card } from "@/shared/ui";

import { DataTableRow } from "../types";

/**
 * Renders each row as a card list (no table markup).
 */
export function DataTableList<TData extends DataTableRow<TData>>({
  table,
  onRowClick,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  onRowClick?: (row: TData) => void;
}) {
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
