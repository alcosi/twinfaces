import { useEffect, useReducer } from "react";

import { DataTableProps, DataTableRow } from "../data-table";
import { FilterState } from "../header";
import { getColumnKey } from "../helpers";

export function useViewSettings<TData extends DataTableRow<TData>, TValue>(
  defaultVisibleColumns: DataTableProps<TData, TValue>["columns"] = [],
  orderedColumns: DataTableProps<TData, TValue>["columns"] = []
) {
  const [viewSettings, updateViewSettings] = useReducer(
    (state: FilterState, updates: Partial<FilterState>) => ({
      ...state,
      ...updates,
    }),
    {
      query: "",
      filters: {},
      visibleKeys: defaultVisibleColumns?.map(getColumnKey) ?? [],
      orderKeys: orderedColumns?.map(getColumnKey) ?? [],
      groupByKey: undefined,
      layoutMode: "grid",
    }
  );

  useEffect(() => {
    if (defaultVisibleColumns) {
      updateViewSettings({
        visibleKeys: defaultVisibleColumns.map(getColumnKey),
      });
    }
  }, [defaultVisibleColumns?.map(getColumnKey).join(",")]);

  return { viewSettings, updateViewSettings };
}
