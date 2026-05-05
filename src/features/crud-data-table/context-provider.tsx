"use client";

import { usePathname } from "next/navigation";
import { ReactNode, createContext, useContext, useRef } from "react";

import {
  TableViewState,
  TableViewStateUpdate,
} from "../../widgets/crud-data-table/header";

type CrudDataTableStore = {
  get: (pathname: string) => TableViewState | null;
  set: (pathname: string, state: TableViewStateUpdate) => void;
  clear: (pathname: string) => void;
  clearByPrefix: (prefix: string) => void;
  getLastBasePath: () => string | null;
  setLastBasePath: (basePath: string) => void;
};

const Context = createContext<CrudDataTableStore | null>(null);

export function CrudDataTableProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<Map<string, Partial<TableViewState>>>(new Map());
  const lastBasePathRef = useRef<string | null>(null);

  const mergeState = (
    current: Partial<TableViewState>,
    updates: TableViewStateUpdate
  ): Partial<TableViewState> => {
    if (updates.filters === null) {
      const { filters, ...rest } = updates;
      return { ...current, ...rest, filters: {} } as Partial<TableViewState>;
    }
    return { ...current, ...updates } as Partial<TableViewState>;
  };

  const store: CrudDataTableStore = {
    get: (pathname) => {
      const state = storeRef.current.get(pathname);
      return state as TableViewState | null;
    },
    set: (pathname, updates) => {
      const current = storeRef.current.get(pathname) ?? {};
      storeRef.current.set(pathname, mergeState(current, updates));
    },
    clear: (pathname) => {
      storeRef.current.delete(pathname);
    },
    clearByPrefix: (prefix) => {
      const keysToDelete: string[] = [];
      storeRef.current.forEach((_, key) => {
        if (key === prefix || key.startsWith(`${prefix}/`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => storeRef.current.delete(key));
    },
    getLastBasePath: () => lastBasePathRef.current,
    setLastBasePath: (basePath) => {
      lastBasePathRef.current = basePath;
    },
  };

  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function useCrudDataTableStore(): CrudDataTableStore {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "useCrudDataTableStore must be used within CrudDataTableProvider"
    );
  }
  return context;
}

export function useCrudDataTableState() {
  const store = useCrudDataTableStore();
  const pathname = usePathname();

  return {
    getState: () => store.get(pathname),
    setState: (updates: TableViewStateUpdate) => store.set(pathname, updates),
    clearState: () => store.clear(pathname),
    getLastBasePath: () => store.getLastBasePath(),
    setLastBasePath: (basePath: string) => store.setLastBasePath(basePath),
  };
}
