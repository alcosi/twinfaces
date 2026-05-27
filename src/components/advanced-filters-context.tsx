import { createContext, useContext } from "react";

import { AutoFormComplexComboboxValueInfo } from "@/components/auto-field";

interface AdvancedFiltersContextValue {
  openAdvancedFilters: (
    filterKey: string,
    info: AutoFormComplexComboboxValueInfo
  ) => void;
}

export const AdvancedFiltersContext =
  createContext<AdvancedFiltersContextValue | null>(null);

export function useAdvancedFiltersContext() {
  return useContext(AdvancedFiltersContext);
}
