import { SelectAdapter } from "../types";

export function createFixedSelectAdapter<T extends string>(
  items: readonly T[]
): SelectAdapter<T> {
  return {
    getById: async (id) => items.find((item) => item === id),
    getItems: async () => [...items],
    getItemKey: (item) => item,
    renderItem: (item) => item,
  };
}
