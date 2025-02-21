import { ReactNode } from "react";

export type SelectAdapter<Entity> = {
  getById: (id: string) => Promise<Entity | undefined>;
  getItems: (id: string, query: string, options?: unknown) => Promise<Entity[]>;
  getItemKey?: (entity: Entity) => string;
  renderItem: (entity: Entity) => ReactNode | string;
};

export type FormFieldValidationError = {
  key: string;
  message: string;
};
