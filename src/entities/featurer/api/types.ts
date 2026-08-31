import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Featurer = components["schemas"]["FeaturerV1"];
export type Featurer_DETAILED = RequireFields<Featurer, "id" | "name">;

export type FeaturerParam = components["schemas"]["FeaturerParamV1"];

export type FeaturerFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "deprecated";
// `typeIdList` is not among the filter keys on purpose: every featurer picker is
// pinned to a single featurer type by its caller, so the type is never a
// user-facing filter — only a part of the payload.
export type FeaturerFilters = Partial<
  Pick<
    components["schemas"]["FeaturerSearchV1"],
    FeaturerFilterKeys | "typeIdList"
  >
>;
