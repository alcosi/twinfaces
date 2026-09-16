import { createContext, useContext } from "react";

import { AutoFormComplexComboboxValueInfo } from "@/components/auto-field";

export interface AdvancedFiltersContextValue {
  openAdvancedFilters: (
    filterKey: string,
    info: AutoFormComplexComboboxValueInfo
  ) => void;
  /**
   * Path of the panel providing this context — "" at the root. The same field
   * name (`viewPermissionIdList`, say) shows up in several nested filter sets,
   * so keys are scoped by their panel to stay unique across the stack.
   */
  path: string;
  /** Filter keys whose advanced-filter panel is currently open in the stack. */
  openKeys: string[];
  /** How many advanced filters are applied, per scoped filter key. */
  appliedCounts: Record<string, number>;
}

export const AdvancedFiltersContext =
  createContext<AdvancedFiltersContextValue | null>(null);

export function useAdvancedFiltersContext() {
  return useContext(AdvancedFiltersContext);
}

export function scopeFilterKey(path: string, filterKey: string) {
  return path ? `${path}.${filterKey}` : filterKey;
}
