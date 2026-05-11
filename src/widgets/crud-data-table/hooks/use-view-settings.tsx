"use client";

import { usePathname } from "next/navigation";
import { useEffect, useReducer } from "react";

import { useCrudDataTableStore } from "@/features/crud-data-table";

import { DataTableProps, DataTableRow } from "../data-table";
import { TableViewState, TableViewStateUpdate } from "../header";
import { getColumnKey } from "../helpers";

const UUID_PATTERN =
  /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;

function isDetailPage(pathname: string): boolean {
  return UUID_PATTERN.test(pathname);
}

function getParentPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1) return `/${segments[0] || ""}`;
  return `/${segments.slice(0, -1).join("/")}`;
}

function getStorageKey(pathname: string): string {
  return isDetailPage(pathname) ? getParentPath(pathname) : pathname;
}

function getTableStorageKey<TData extends DataTableRow<TData>, TValue>(
  baseStorageKey: string,
  defaultVisibleColumns: DataTableProps<TData, TValue>["columns"],
  orderedColumns: DataTableProps<TData, TValue>["columns"],
  columns: DataTableProps<TData, TValue>["columns"]
): string {
  const storageColumns = defaultVisibleColumns.length
    ? defaultVisibleColumns
    : columns.length
      ? columns
      : orderedColumns;
  const columnSignature = storageColumns.map(getColumnKey).join("|");

  return columnSignature
    ? `${baseStorageKey}::${columnSignature}`
    : baseStorageKey;
}

function getInitialState<TData extends DataTableRow<TData>, TValue>(
  savedState: TableViewState | null,
  hasNavigatedToNewPage: boolean,
  defaultVisibleColumns: DataTableProps<TData, TValue>["columns"],
  orderedColumns: DataTableProps<TData, TValue>["columns"]
): TableViewState {
  const defaultVisibleKeys = defaultVisibleColumns?.map(getColumnKey) ?? [];
  const defaultOrderKeys = orderedColumns?.map(getColumnKey) ?? [];

  return {
    query: hasNavigatedToNewPage ? "" : (savedState?.query ?? ""),
    filters: hasNavigatedToNewPage ? {} : (savedState?.filters ?? {}),
    visibleKeys: hasNavigatedToNewPage
      ? defaultVisibleKeys
      : (savedState?.visibleKeys ?? defaultVisibleKeys),
    orderKeys: hasNavigatedToNewPage
      ? defaultOrderKeys
      : (savedState?.orderKeys ?? defaultOrderKeys),
    groupByKey: hasNavigatedToNewPage ? undefined : savedState?.groupByKey,
    layoutMode: hasNavigatedToNewPage
      ? "grid"
      : (savedState?.layoutMode ?? "grid"),
  };
}

export function useViewSettings<TData extends DataTableRow<TData>, TValue>(
  defaultVisibleColumns: DataTableProps<TData, TValue>["columns"] = [],
  orderedColumns: DataTableProps<TData, TValue>["columns"] = [],
  columns: DataTableProps<TData, TValue>["columns"] = []
) {
  const store = useCrudDataTableStore();
  const pathname = usePathname();

  const storageKey = getStorageKey(pathname);
  const tableStorageKey = getTableStorageKey(
    storageKey,
    defaultVisibleColumns,
    orderedColumns,
    columns
  );
  const lastStorageKey = store.getLastBasePath();
  const hasNavigatedToNewPage = Boolean(
    lastStorageKey && lastStorageKey !== storageKey
  );
  const savedState = hasNavigatedToNewPage ? null : store.get(tableStorageKey);

  const [viewSettings, updateViewSettings] = useReducer(
    (state: TableViewState, updates: TableViewStateUpdate): TableViewState => {
      const result = {
        ...state,
        ...updates,
        ...(updates.filters === null ? { filters: {} } : {}),
      } as TableViewState;
      store.set(tableStorageKey, updates);
      return result;
    },
    getInitialState(
      savedState,
      hasNavigatedToNewPage,
      defaultVisibleColumns,
      orderedColumns
    )
  );

  useEffect(() => {
    if (hasNavigatedToNewPage && lastStorageKey) {
      store.clearByPrefix(lastStorageKey);
    }
    store.setLastBasePath(storageKey);
  }, [storageKey, hasNavigatedToNewPage, lastStorageKey, store]);

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
