export interface FiltersState<TFilterKeys extends string = string> {
  search?: string;
  filters: Record<TFilterKeys, any>;
}
