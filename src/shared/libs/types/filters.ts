import { AutoFormValueInfo } from "@/components/auto-field";

export type FilterFeature<FilterKey extends string, RequestPayload> = {
  buildFilterFields: (
    filters?: FilterKey[]
  ) => Partial<Record<FilterKey, AutoFormValueInfo>>;
  mapFiltersToPayload: (filters: Record<FilterKey, unknown>) => RequestPayload;
};
