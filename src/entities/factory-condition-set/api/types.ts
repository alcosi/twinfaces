import { components } from "@/shared/api/generated/schema";

export type FactoryConditionSet =
  components["schemas"]["FactoryConditionSetV1"];
export type FactoryConditionSet_DETAILED = Required<FactoryConditionSet>;

export type FactoryConditionSetSearchRq =
  components["schemas"]["FactoryConditionSetSearchRqV1"];

export type FactoryConditionSetFilterKeys =
  | "idList"
  | "idExcludeList"
  | "nameLikeList"
  | "nameNotLikeList"
  | "descriptionLikeList"
  | "descriptionNotLikeList";

export type FactoryConditionSetFilters = Partial<
  Pick<FactoryConditionSetSearchRq, FactoryConditionSetFilterKeys>
>;
