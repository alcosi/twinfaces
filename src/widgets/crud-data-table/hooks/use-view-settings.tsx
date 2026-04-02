"use client";

import { usePathname } from "next/navigation";
import { useEffect, useReducer } from "react";

import {
  useCrudDataTableState,
  useCrudDataTableStore,
} from "@/features/crud-data-table";

import { DataTableProps, DataTableRow } from "../data-table";
import { TableViewState } from "../header";
import { getColumnKey } from "../helpers";

// Helper functions
function isDetailPage(pathname: string): boolean {
  return /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i.test(
    pathname
  );
}

function getParentPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return `/${segments[0] || ""}`;
  return `/${segments.slice(0, -1).join("/")}`;
}

function getStorageKey(pathname: string): string {
  return isDetailPage(pathname) ? getParentPath(pathname) : pathname;
}

export function useViewSettings<TData extends DataTableRow<TData>, TValue>(
  defaultVisibleColumns: DataTableProps<TData, TValue>["columns"] = [],
  orderedColumns: DataTableProps<TData, TValue>["columns"] = []
) {
  const { getState, setState, getLastBasePath, setLastBasePath } =
    useCrudDataTableState();
  const store = useCrudDataTableStore();
  const pathname = usePathname();

  const storageKey = getStorageKey(pathname);
  const lastStorageKey = getLastBasePath();
  const hasNavigatedToNewPage = lastStorageKey && lastStorageKey !== storageKey;

  const savedState = hasNavigatedToNewPage ? null : getState();

  const [viewSettings, updateViewSettings] = useReducer(
    (state: TableViewState, updates: Partial<TableViewState>) => {
      const newState = { ...state, ...updates };
      setState(updates);
      return newState;
    },
    {
      query: hasNavigatedToNewPage ? "" : (savedState?.query ?? ""),
      filters: hasNavigatedToNewPage ? {} : (savedState?.filters ?? {}),
      visibleKeys: hasNavigatedToNewPage
        ? (defaultVisibleColumns?.map(getColumnKey) ?? [])
        : (savedState?.visibleKeys ??
          defaultVisibleColumns?.map(getColumnKey) ??
          []),
      orderKeys: hasNavigatedToNewPage
        ? (orderedColumns?.map(getColumnKey) ?? [])
        : (savedState?.orderKeys ?? orderedColumns?.map(getColumnKey) ?? []),
      groupByKey: hasNavigatedToNewPage
        ? undefined
        : (savedState?.groupByKey ?? undefined),
      layoutMode: hasNavigatedToNewPage
        ? "grid"
        : (savedState?.layoutMode ?? "grid"),
    }
  );

  // Clear filters when navigating to a different page
  useEffect(() => {
    if (hasNavigatedToNewPage && lastStorageKey) {
      store.clearByPrefix(lastStorageKey);
    }
    setLastBasePath(storageKey);
  }, [
    storageKey,
    hasNavigatedToNewPage,
    lastStorageKey,
    setLastBasePath,
    store,
  ]);

  // Initialize visible columns
  useEffect(() => {
    if (
      defaultVisibleColumns &&
      !savedState?.visibleKeys &&
      !hasNavigatedToNewPage
    ) {
      updateViewSettings({
        visibleKeys: defaultVisibleColumns.map(getColumnKey),
      });
    }
  }, [defaultVisibleColumns?.map(getColumnKey).join(",")]);

  return { viewSettings, updateViewSettings };
}
