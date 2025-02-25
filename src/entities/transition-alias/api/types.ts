import { components } from "@/shared/api/generated/schema";

export type TransitionAliasV1 = components["schemas"]["TransitionAliasV1"];

export type TransitionAliasFiltersKeys =
  | "idList"
  | "idExcludeList"
  | "aliasLikeList"
  | "aliasNotLikeList";

export type TransitionAliasFilters = Partial<
  Pick<
    components["schemas"]["TransitionAliasSearchRqV1"],
    TransitionAliasFiltersKeys
  >
>;
