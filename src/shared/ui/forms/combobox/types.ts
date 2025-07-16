import { SelectAdapter } from "@/shared/libs";

// NOTE: Internal Types
export type ComboboxHandle<T> = {
  getSelected: () => T[];
  setSelected: (newSelected: T | T[] | undefined) => void;
};

export type ComboboxStrategy<T> = {
  handleSelect: (newItem: T, getItemKey: (item: T) => string) => T[];
};

// NOTE: External Types
export interface ComboboxProps<T> extends SelectAdapter<T> {
  buttonClassName?: string;
  contentClassName?: string;
  multi?: boolean;
  noItemsText?: string;
  onSelect?: (items?: T[]) => void;
  searchDelay?: number;
  searchPlaceholder?: string;
  selectPlaceholder?: string;
  initialValues?: T[];
  disabled?: boolean;
  creatable?: boolean;
}
