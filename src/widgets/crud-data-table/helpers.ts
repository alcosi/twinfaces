import { ForwardedRef } from "react";

import { DataTableHandle, DataTableRow } from "./data-table";

export function getColumnKey(column: any): string {
  // Type guard to check if the column has an `accessorKey` property
  if ("accessorKey" in column && typeof column.accessorKey === "string") {
    return column.accessorKey;
  }
  // Fallback to using `id` if `accessorKey` does not exist
  return column.id as string;
}

function humanizeKey(key: string): string {
  const spaced = key
    .replace(/[_-]+/g, " ")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .trim();
  if (!spaced) return key;
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/**
 * Resolves a human-readable label for a column, used by the column-visibility
 * manager. A column's `header` may be a plain string, or a render function
 * (e.g. one returning `<SortableHeader title="..." />`). Rendering that
 * function here is unsafe — it relies on table-only context — so we read the
 * `title` prop off the returned element and fall back to a humanized key.
 */
export function getColumnLabel(column: any): string {
  const header = column.header;

  if (typeof header === "string") return header;

  if (typeof header === "function") {
    try {
      const node = header({ column });
      const title = node?.props?.title;
      if (typeof title === "string") return title;
    } catch {
      // Header relies on render-time context; fall back to the key.
    }
  }

  return humanizeKey(getColumnKey(column));
}

export function safeRefresh(ref: ForwardedRef<DataTableHandle>) {
  if (ref && "current" in ref && ref.current) {
    ref.current.refresh();
  }
}

export function safeResetPage(ref: ForwardedRef<DataTableHandle>) {
  if (ref && "current" in ref && ref.current) {
    ref.current.resetPage();
  }
}

export function groupDataByKey<TData extends DataTableRow<TData>>(
  data: TData[],
  groupByKey: keyof TData
): TData[] {
  const groupedData = data.reduce(
    (acc, item) => {
      const groupKey = item[groupByKey];

      if (!acc[groupKey]) {
        acc[groupKey] = {
          [groupByKey]: groupKey,
          subRows: [],
        };
      }

      acc[groupKey].subRows.push(item);
      return acc;
    },
    {} as Record<string, any>
  );

  // Convert grouped data to an array of grouped items with subRows
  return Object.values(groupedData);
}
