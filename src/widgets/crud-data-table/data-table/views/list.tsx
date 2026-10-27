import { flexRender, useReactTable } from "@tanstack/react-table";
import { ReactNode } from "react";

import { cn } from "@/shared/libs";
import {
  EntityCard,
  EntityCardField,
  EntityCardFields,
  EntityCardHeader,
  EntityCardSection,
} from "@/shared/ui/entity-card";

import { DataTableCardHeader, DataTableRow } from "../types";
import { RowContextMenu } from "./row-context-menu";

const ACTIONS_COLUMN_ID = "actions";

/**
 * Renders each row as the app's entity card (no table markup): a grid of
 * cards, each row's visible columns as its fields, under an optional header.
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
  getRowHref,
  renderItem,
  cardHeader,
}: {
  table: ReturnType<typeof useReactTable<TData>>;
  onRowClick?: (row: TData) => void;
  getRowHref?: (row: TData) => string | undefined;
  renderItem?: (row: TData) => ReactNode;
  cardHeader?: DataTableCardHeader<TData>;
}) {
  if (renderItem) {
    return (
      <div className="flex flex-col gap-4 pr-3">
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

  // With a header, the actions column moves into its corner and the columns
  // it already shows drop out of the body. Without one, every column stays a
  // field — the actions included — exactly as the row has them.
  const headerColumnIds = new Set(cardHeader?.columnIds ?? []);
  const bodyColumns = visibleColumns.filter(
    (column) =>
      !cardHeader ||
      (column.id !== ACTIONS_COLUMN_ID && !headerColumnIds.has(column.id))
  );

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] content-start gap-3 pr-3">
      {table.getRowModel().rows.map((row) => {
        const cellOf = (columnId: string) =>
          row.getAllCells().find((cell) => cell.column.id === columnId);
        const actionsCell = cardHeader ? cellOf(ACTIONS_COLUMN_ID) : undefined;

        return (
          <RowContextMenu key={row.id} href={getRowHref?.(row.original)}>
            <EntityCard
              interactive={Boolean(onRowClick)}
              onClick={() => onRowClick?.(row.original)}
              className="h-full"
            >
              {cardHeader && (
                <EntityCardHeader
                  {...cardHeader.get(row.original)}
                  actions={
                    actionsCell &&
                    flexRender(
                      actionsCell.column.columnDef.cell,
                      actionsCell.getContext()
                    )
                  }
                />
              )}

              {bodyColumns.length > 0 && (
                <EntityCardSection
                  // The header draws the divider; the first section of a card
                  // without one has nothing above it to divide from.
                  className={cn(!cardHeader && "border-t-0")}
                >
                  <EntityCardFields>
                    {bodyColumns.map((column) => {
                      const cell = cellOf(column.id);
                      const header = headersMap.get(column.id);

                      return (
                        <EntityCardField
                          key={column.id}
                          label={
                            header
                              ? flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )
                              : column.id
                          }
                        >
                          {cell &&
                            flexRender(
                              column.columnDef.cell,
                              cell.getContext()
                            )}
                        </EntityCardField>
                      );
                    })}
                  </EntityCardFields>
                </EntityCardSection>
              )}
            </EntityCard>
          </RowContextMenu>
        );
      })}
    </div>
  );
}
