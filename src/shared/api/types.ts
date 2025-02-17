import { components } from "./generated/schema";

// Misc
export type RelatedObjects = components["schemas"]["RelatedObjectsV1"];

export type PaginationV1 = components["schemas"]["PaginationV1"];
export type PagedResponse<T> = {
  data: T[];
  pagination: PaginationV1;
};
