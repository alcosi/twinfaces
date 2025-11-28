import { components } from "@/shared/api/generated/schema";

export type FactoryConditionSet =
  components["schemas"]["FactoryConditionSetV1"];

export type User = components["schemas"]["UserV1"];

export type FactoryConditionSet_DETAILED = FactoryConditionSet & {
  createdByUser?: User;
};

export type FactoryConditionSetSearchRq =
  components["schemas"]["FactoryConditionSetSearchRqV1"];

export type FactoryConditionSetFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList";

export type FactoryConditionSetFilters = Partial<
  Pick<FactoryConditionSetSearchRq, FactoryConditionSetFilterKeys>
>;

export type FactoryConditionSetCreateRq =
  components["schemas"]["FactoryConditionSetCreateRqDTOv1"];
