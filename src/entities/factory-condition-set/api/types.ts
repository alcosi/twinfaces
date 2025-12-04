import { User } from "@/entities/user";
import { components, operations } from "@/shared/api/generated/schema";

export type FactoryConditionSet =
  components["schemas"]["FactoryConditionSetV1"];

export type FactoryConditionSet_DETAILED = FactoryConditionSet & {
  createdByUser?: User;
};

export type FactoryConditionSetViewQuery =
  operations["factoryConditionSetViewV1"]["parameters"]["query"];

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
  components["schemas"]["FactoryConditionSetCreateRqV1"];

export type FactoryConditionSetUpdateRq =
  components["schemas"]["FactoryConditionSetUpdateRqV1"];
