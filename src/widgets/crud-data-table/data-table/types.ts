import { ColumnDef, PaginationState } from "@tanstack/react-table";

import { PagedResponse } from "@/shared/api";
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
  // TODO: ??? @berdimyradov
  viewMode?: "horizontal" | "vertical";
};
