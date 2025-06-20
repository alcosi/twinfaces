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

export type Result<T = void, E = any> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export type ParsedError = { statusCode: number; statusDetails: string };
