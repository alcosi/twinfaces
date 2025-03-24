import { SelectAdapter } from "../types";

// Utility function to create an enum from a string union type
export const createEnum = <T extends string>(values: T[]): { [K in T]: K } => {
  return values.reduce((acc, value) => {
    acc[value] = value;
    return acc;
  }, Object.create(null));
};

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
