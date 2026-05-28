import { SortV1 } from "@/shared/api";

export interface FiltersState<TFilterKeys extends string = string> {
  search?: string;
  filters: Record<TFilterKeys, any>;
  sort?: SortV1;
}
