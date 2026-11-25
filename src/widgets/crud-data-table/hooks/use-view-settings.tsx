"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useReducer, useRef } from "react";

import { useCrudDataTableStore } from "@/features/crud-data-table";
import { isPopulatedString } from "@/shared/libs";

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

/**
 * The area a page belongs to. A detail page reports its list page, so drilling
 * into a row keeps the list's view state alive — and restores it on the way
 * back — while moving to another area clears it.
 */
function getStorageKey(pathname: string): string {
  return isDetailPage(pathname) ? getParentPath(pathname) : pathname;
}

/**
 * Identity of a single table's stored view state. Unlike the area key above it
 * is built from the *real* pathname, so a table embedded in a detail page never
 * shares an entry with the list table it happens to have the same columns as.
 * `title` separates sibling tables on one page (e.g. "Heads" and "Childs"), the
 * column signature separates tables that differ only by their columns. Every
 * key still starts with the area key, so leaving the area clears them all.
 */
function getTableStorageKey<TData extends DataTableRow<TData>, TValue>(
  pathname: string,
  title: string | undefined,
  defaultVisibleColumns: DataTableProps<TData, TValue>["columns"],
  orderedColumns: DataTableProps<TData, TValue>["columns"],
  columns: DataTableProps<TData, TValue>["columns"]
): string {
  const storageColumns = defaultVisibleColumns.length
    ? defaultVisibleColumns
    : columns.length
      ? columns
      : orderedColumns;

  return [pathname, title, storageColumns.map(getColumnKey).join("|")]
    .filter(isPopulatedString)
    .join("::");
}

function getInitialState<TData extends DataTableRow<TData>, TValue>(
  savedState: TableViewState | null,
  hasNavigatedToNewPage: boolean,
  defaultVisibleColumns: DataTableProps<TData, TValue>["columns"],
  orderedColumns: DataTableProps<TData, TValue>["columns"],
  defaultLayoutMode: "grid" | "list"
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
    groupFieldKeys: hasNavigatedToNewPage
      ? undefined
      : savedState?.groupFieldKeys,
    layoutMode: hasNavigatedToNewPage
      ? defaultLayoutMode
      : (savedState?.layoutMode ?? defaultLayoutMode),
    sort: hasNavigatedToNewPage ? undefined : savedState?.sort,
  };
}

type ViewSettingsAction =
  | { kind: "update"; updates: TableViewStateUpdate }
  | { kind: "reset"; state: TableViewState };

type ViewSettingsOptions<TData extends DataTableRow<TData>, TValue> = {
  defaultVisibleColumns?: DataTableProps<TData, TValue>["columns"];
  orderedColumns?: DataTableProps<TData, TValue>["columns"];
  columns?: DataTableProps<TData, TValue>["columns"];
  defaultLayoutMode?: "grid" | "list";
  /** The table's heading — part of its storage identity, see above. */
  title?: string;
};

export function useViewSettings<TData extends DataTableRow<TData>, TValue>({
  defaultVisibleColumns = [],
  orderedColumns = [],
  columns = [],
  defaultLayoutMode = "grid",
  title,
}: ViewSettingsOptions<TData, TValue> = {}) {
  const store = useCrudDataTableStore();
  const pathname = usePathname();

  const storageKey = getStorageKey(pathname);
  const tableStorageKey = getTableStorageKey(
    pathname,
    title,
    defaultVisibleColumns,
    orderedColumns,
    columns
  );
  const lastStorageKey = store.getLastBasePath();
  const hasNavigatedToNewPage = Boolean(
    lastStorageKey && lastStorageKey !== storageKey
  );
  const savedState = hasNavigatedToNewPage ? null : store.get(tableStorageKey);

  const [viewSettings, dispatch] = useReducer(
    (state: TableViewState, action: ViewSettingsAction): TableViewState => {
      if (action.kind === "reset") return action.state;

      const { updates } = action;
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
      orderedColumns,
      defaultLayoutMode
    )
  );

  const updateViewSettings = useCallback(
    (updates: TableViewStateUpdate) => dispatch({ kind: "update", updates }),
    []
  );

  // The storage key includes the column signature, and some tables (WT001)
  // only get part of their columns on the first render — the rest arrive once
  // the twin class fields are fetched. When the key changes, the state still
  // holds what was read under the old key (e.g. only the static columns as
  // visible), so re-read it from the entry the table really belongs to.
  const loadedStorageKeyRef = useRef(tableStorageKey);
  useEffect(() => {
    if (loadedStorageKeyRef.current === tableStorageKey) return;
    loadedStorageKeyRef.current = tableStorageKey;

    dispatch({
      kind: "reset",
      state: getInitialState(
        savedState,
        hasNavigatedToNewPage,
        defaultVisibleColumns,
        orderedColumns,
        defaultLayoutMode
      ),
    });
  }, [tableStorageKey]);

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
