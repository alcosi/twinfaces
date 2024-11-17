import { SelectAdapter } from "@/shared/libs";
import { ReactNode } from "react";

// Base properties shared between single and multi comboboxes
interface BaseComboboxProps<T> extends SelectAdapter<T> {
  renderInList?: (value: T) => ReactNode;
  renderSelected?: (value: T) => ReactNode;
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  noItemsText?: string;
  buttonClassName?: string;
  contentClassName?: string;
  searchDelay?: number;
  multi?: boolean;
}

export type ComboboxHandle<T> = {
  getSelected: () => T[];
  setSelected: (newSelected: T | T[] | undefined) => void;
};

export interface ComboboxProps<T> extends BaseComboboxProps<T> {
  value?: T;
  onSelect?: (value?: T) => any;
}

export interface MultiComboboxProps<T> extends BaseComboboxProps<T> {
  onSelect?: (value?: T[]) => any;
}
