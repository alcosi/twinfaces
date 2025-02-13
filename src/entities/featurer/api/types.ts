import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Featurer = components["schemas"]["FeaturerV1"];
export type Featurer_DETAILED = RequireFields<Featurer, "id" | "name">;

export type FeaturerParam = components["schemas"]["FeaturerParamV1"];

export type FeaturerFilterKeys = "idList" | "typeIdList" | "nameLikeList";
export type FeaturerFilters = Partial<
  Pick<components["schemas"]["FeaturerSearchRqV1"], FeaturerFilterKeys>
>;
