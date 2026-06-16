import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ReactNode } from "react";

import { PagedResponse, SortV1 } from "@/shared/api";
import { Identifiable } from "@/shared/libs";

export type DataTableHandle = {
  refresh: () => void;
  resetPage: () => void;
  // getFilterValues: () => PaginatedTableFilterValues | undefined;
  // setFilterValues: (values?: PaginatedTableFilterValues) => any;
};

export interface DataTableRow<TData> extends Object, Identifiable {
  subRows?: TData[];
  [key: string]: any; // Allow indexing by string
}

export type DataTableProps<TData extends DataTableRow<TData>, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  getRowId: (row: TData, index: number) => string;
  fetcher: (pagination: PaginationState) => Promise<PagedResponse<TData>>;
  disablePagination?: boolean;
  pageSizes?: number[];
  onFetchError?: (e: Error) => void;
  onRowClick?: (row: TData) => void;
  layoutMode?: "grid" | "list";
  sort?: SortV1;
  onSortChange?: (sort: SortV1 | undefined) => void;
  /**
   * Jira-style column-visibility control rendered inside the sticky actions
   * column header (grid view only). When omitted, the actions header falls
   * back to its normal label.
   */
  columnManager?: ReactNode;
  /**
   * Custom renderer for a single row in the card ("list") layout. When
   * provided, the list view renders this instead of the generic
   * column-derived card — letting a consumer show a rich, bespoke card (e.g.
   * a comment bubble) while keeping the shared toolbar, sorting, paging and
   * pie-chart view. Ignored in the grid (table) layout.
   */
  renderListItem?: (row: TData) => ReactNode;
};
