import { createContext, useContext } from "react";

import { AutoFormComplexComboboxValueInfo } from "@/components/auto-field";

export interface AdvancedFiltersContextValue {
  openAdvancedFilters: (
    filterKey: string,
    info: AutoFormComplexComboboxValueInfo
  ) => void;
  /** Filter keys whose advanced-filter panel is currently open in the stack. */
  openKeys: string[];
  /** How many advanced filters are applied, per filter key. */
  appliedCounts: Record<string, number>;
}

export const AdvancedFiltersContext =
  createContext<AdvancedFiltersContextValue | null>(null);

export function useAdvancedFiltersContext() {
  return useContext(AdvancedFiltersContext);
}
