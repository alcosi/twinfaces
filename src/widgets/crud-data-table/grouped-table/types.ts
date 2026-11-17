import { PaginationState } from "@tanstack/react-table";
import { ReactNode } from "react";

import { PagedResponse, SortV1 } from "@/shared/api";

/** The active query, filters and sort every grouping request is bound to. */
export type TableQueryContext = {
  search?: string;
  filters: Record<string, unknown>;
  sort?: SortV1;
};

/** A field the table can be grouped by. */
export type TableGroupField = {
  key: string;
  label: string;
};

/**
 * One step down the group tree: the field of that level and the value of the
 * group the user opened. `null` is the group of rows with no value set.
 */
export type GroupPathStep = {
  fieldKey: string;
  value: string | null;
};

/** A group as the count endpoint reports it. */
export type GroupBucket = {
  value: string | null;
  label: ReactNode;
  count: number;
};

export type GroupPage = {
  items: GroupBucket[];
  /** Number of groups on this level across all pages. */
  total: number;
};

/**
 * Server-side, multi-level grouping of the table view. A level is listed by
 * `countGroups` — narrowed by the groups opened above it — and the rows of the
 * last level come from `fetchRows`, narrowed by the whole path.
 */
export type TableGrouping<TData> = {
  fields: TableGroupField[];
  countGroups: (args: {
    fieldKey: string;
    path: GroupPathStep[];
    offset: number;
    limit: number;
    context: TableQueryContext;
  }) => Promise<GroupPage>;
  fetchRows: (args: {
    path: GroupPathStep[];
    pagination: PaginationState;
    context: TableQueryContext;
  }) => Promise<PagedResponse<TData>>;
};
