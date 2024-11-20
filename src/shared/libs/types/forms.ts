export type SelectAdapter<Entity> = {
  getById: (id: string) => Promise<Entity | undefined>;
  getItems: (query: string) => Promise<Entity[]>;
  getItemKey: (entity: Entity) => string;
  getItemLabel: (entity: Entity) => string;
};
