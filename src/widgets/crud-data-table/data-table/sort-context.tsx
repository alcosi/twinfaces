"use client";

import { createContext, useContext } from "react";

import { SortV1 } from "@/shared/api";

type SortContextValue = {
  sort: SortV1 | undefined;
  onSortChange: (sort: SortV1 | undefined) => void;
};

const SortContext = createContext<SortContextValue | null>(null);

export function SortProvider({
  sort,
  onSortChange,
  children,
}: SortContextValue & { children: React.ReactNode }) {
  return (
    <SortContext.Provider value={{ sort, onSortChange }}>
      {children}
    </SortContext.Provider>
  );
}

export function useSortContext() {
  const ctx = useContext(SortContext);
  if (!ctx) {
    throw new Error("useSortContext must be used within SortProvider");
  }
  return ctx;
}
