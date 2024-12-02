import { ReactNode } from "react";

export type SelectAdapter<Entity> = {
  getById: (id: string) => Promise<Entity | undefined>;
  getItems: (query: string) => Promise<Entity[]>;
  getItemKey?: (entity: Entity) => string;
  renderItem: (entity: Entity) => ReactNode | string;
};
