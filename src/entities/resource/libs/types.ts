import { components } from "@/shared/api/generated/schema";

export type Resource = components["schemas"]["ResourceV1"];
/** Upload endpoint returns ResourceListRsV1, elements are ResourceV1 (same schema as search rows). */
export type ResourceUploadResult = components["schemas"]["ResourceV1"];
export type ResourceFilters = components["schemas"]["ResourceSearchV1"];
export type ResourceFilterKeys = keyof ResourceFilters;
export type ResourceSortField =
  components["schemas"]["ResourceSearchRqV1"]["sortField"];
