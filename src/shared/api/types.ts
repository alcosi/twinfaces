import { PaginationState } from "@tanstack/react-table";

import { components } from "./generated/schema";

// ──────────────────────────────────────────────────────────────
// OpenAPI Schema Aliases
// ──────────────────────────────────────────────────────────────
export type RelatedObjects = components["schemas"]["RelatedObjectsV1"];
export type PaginationV1 = components["schemas"]["PaginationV1"];
export type DataTimeRangeV1 = components["schemas"]["DataTimeRangeV1"];

// Misc
export type Result<T, E = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export type PagedResponse<T> = {
  data: T[];
  pagination: PaginationV1;
};

export type SearchParams<TFilters> = {
  search?: string;
  pagination?: PaginationState;
  filters?: TFilters;
};

export type ApiErrorResponse = {
  status: number;
  msg: string;
  statusDetails: string;
};

// ──────────────────────────────────────────────────────────────
// Request Specs
// ──────────────────────────────────────────────────────────────
export type GenericRequest<Narrow = undefined> = {
  query?: PaginationV1;
  body?: RequestPayload<Narrow>;
};

export type RequestPayload<Narrow = undefined> = {
  params?: Record<string, string>;
  narrow?: Narrow;
};

export type HttpPostSpec<Narrow> = {
  query?: PaginationV1 & {
    lazyRelation?: false;
    sortAsc?: boolean;
  };

  header?: {
    DomainId: string;
    AuthToken: string;
    Channel: string;
  };

  path: { searchId: string };

  body: RequestPayload<Narrow>;
};
