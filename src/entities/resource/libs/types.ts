import { components } from "@/shared/api/generated/schema";

export type Resource = components["schemas"]["ResourceV1"];
export type ResourceUploadResult = components["schemas"]["ResourceUploadV1"];
export type ResourceFilters = components["schemas"]["ResourceSearchV1"];
export type ResourceFilterKeys = keyof ResourceFilters;
export type ResourceSortField =
  components["schemas"]["ResourceSearchRqV1"]["sortField"];
