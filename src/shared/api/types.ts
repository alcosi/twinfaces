import { PaginationState } from "@tanstack/react-table";

import { components } from "./generated/schema";

// Misc
export type RelatedObjects = components["schemas"]["RelatedObjectsV1"];

export type PaginationV1 = components["schemas"]["PaginationV1"];
export type PagedResponse<T> = {
  data: T[];
  pagination: PaginationV1;
};

export type SearchParams<TFilters> = {
  search?: string;
  pagination?: PaginationState;
  filters?: TFilters;
};

export type DataTimeRangeV1 = components["schemas"]["DataTimeRangeV1"];

export type Result<T, E = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: E };

// Todo: remove
export type ParsedError = { statusCode: number; statusDetails: string };
