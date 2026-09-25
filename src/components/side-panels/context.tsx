import { ReactNode, createContext, useContext } from "react";

import { AutoFormComplexComboboxValueInfo } from "@/components/auto-field";

import { CascadeCreateConfig } from "./create-entities";

export interface OpenCascadeCreateArgs {
  config: CascadeCreateConfig;
  /** Shown in the panel header, so the user sees what they came from. */
  label?: ReactNode;
  /**
   * Receives the id of the entity that was just created — `undefined` when the
   * API didn't hand one back, which only means it can't be preselected.
   */
  onCreated: (id?: string) => void | Promise<void>;
}

export interface SidePanelsContextValue {
  openAdvancedFilters: (
    filterKey: string,
    info: AutoFormComplexComboboxValueInfo
  ) => void;
  openCascadeCreate: (key: string, args: OpenCascadeCreateArgs) => void;
  /**
   * Cascading creation belongs to the create/edit sheet; the table's filters
   * sidebar only ever narrows a list, so it leaves this off.
   */
  cascadeCreateEnabled: boolean;
  /**
   * Path of the panel providing this context — "" at the root. The same field
   * name (`viewPermissionIdList`, say) shows up in several nested filter sets,
   * so keys are scoped by their panel to stay unique across the stack.
   */
  path: string;
  /** Panel keys currently open in the stack. */
  openKeys: string[];
  /** How many advanced filters are applied, per scoped filter key. */
  appliedCounts: Record<string, number>;
}

export const SidePanelsContext = createContext<SidePanelsContextValue | null>(
  null
);

export function useSidePanelsContext() {
  return useContext(SidePanelsContext);
}

export function scopeFilterKey(path: string, filterKey: string) {
  return path ? `${path}.${filterKey}` : filterKey;
}

/**
 * A field can have both panels open over its lifetime, so its create panel
 * needs a key of its own — otherwise opening one would replace the other.
 */
export function scopeCreateKey(path: string, filterKey: string) {
  return `${scopeFilterKey(path, filterKey)}::create`;
}
