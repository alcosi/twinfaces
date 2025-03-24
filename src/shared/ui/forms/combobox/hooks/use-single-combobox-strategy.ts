import { ComboboxStrategy } from "../types";

export function useSingleComboboxStrategy<T>(
  selected: T[],
  setSelected: (newSelected: T[]) => void
): ComboboxStrategy<T> {
  const handleSelect = (newItem: T, getItemKey: (item: T) => string) => {
    const isSelected =
      selected[0] && getItemKey(selected[0]) === getItemKey(newItem);

    const updatedSelection = isSelected ? [] : [newItem];
    setSelected(updatedSelection);

    return updatedSelection;
  };

  return {
    handleSelect,
  };
}
