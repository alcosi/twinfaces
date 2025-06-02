import { useEffect, useReducer } from "react";

import { DataTableProps, DataTableRow } from "../data-table";
import { TableViewState } from "../header";
import { getColumnKey } from "../helpers";

export function useViewSettings<TData extends DataTableRow<TData>, TValue>(
  defaultVisibleColumns: DataTableProps<TData, TValue>["columns"] = [],
  orderedColumns: DataTableProps<TData, TValue>["columns"] = []
) {
  const [viewSettings, updateViewSettings] = useReducer(
    (state: TableViewState, updates: Partial<TableViewState>) => ({
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
