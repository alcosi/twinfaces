"use client";

import { usePathname } from "next/navigation";
import { ReactNode, createContext, useContext, useRef } from "react";

import { TableViewState } from "../../widgets/crud-data-table/header";

type CrudDataTableStore = {
  get: (pathname: string) => TableViewState | null;
  set: (pathname: string, state: Partial<TableViewState>) => void;
  clear: (pathname: string) => void;
  clearByPrefix: (prefix: string) => void;
  getLastBasePath: () => string | null;
  setLastBasePath: (basePath: string) => void;
};

const ContextProvider = createContext<CrudDataTableStore | null>(null);

export function CrudDataTableProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<Map<string, Partial<TableViewState>>>(new Map());
  const lastBasePathRef = useRef<string | null>(null);

  const store: CrudDataTableStore = {
    get: (pathname: string) => {
      const state = storeRef.current.get(pathname);
      if (!state) return null;
      return state as TableViewState;
    },
    set: (pathname: string, updates: Partial<TableViewState>) => {
      const current = storeRef.current.get(pathname) || {};
      storeRef.current.set(pathname, { ...current, ...updates });
    },
    clear: (pathname: string) => {
      storeRef.current.delete(pathname);
    },
    clearByPrefix: (prefix: string) => {
      const keysToDelete: string[] = [];
      storeRef.current.forEach((_, key) => {
        // Check if key starts with the prefix (exact match or child path)
        if (key === prefix || key.startsWith(`${prefix}/`)) {
          keysToDelete.push(key);
        }
      });
      keysToDelete.forEach((key) => storeRef.current.delete(key));
    },
    getLastBasePath: () => lastBasePathRef.current,
    setLastBasePath: (basePath: string) => {
      lastBasePathRef.current = basePath;
    },
  };

  return (
    <ContextProvider.Provider value={store}>
      {children}
    </ContextProvider.Provider>
  );
}

export function useCrudDataTableStore() {
  const context = useContext(ContextProvider);
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
    setState: (updates: Partial<TableViewState>) =>
      store.set(pathname, updates),
    clearState: () => store.clear(pathname),
    getLastBasePath: () => store.getLastBasePath(),
    setLastBasePath: (basePath: string) => store.setLastBasePath(basePath),
  };
}
