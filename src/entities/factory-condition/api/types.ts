import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { ExtendedFeaturerParam, Featurer } from "@/entities/featurer";
import { components } from "@/shared/api/generated/schema";

export type FactoryCondition = components["schemas"]["FactoryConditionV1"];

export type FactoryCondition_DETAILED = Required<FactoryCondition> & {
  factoryConditionSet?: FactoryConditionSet;
  conditionerFeaturer?: Featurer;
  conditionerDetailedParams?: ExtendedFeaturerParam[];
};

export type FactoryConditionSearchRq =
  components["schemas"]["FactoryConditionSearchRqV1"];

export type FactoryConditionFilterKeys =
  | "idList"
  | "factoryConditionSetIdList"
  | "conditionerFeaturerIdList"
  | "descriptionLikeList"
  | "invert"
  | "active";

export type FactoryConditionFilters = Partial<
  Pick<FactoryConditionSearchRq, FactoryConditionFilterKeys>
>;

export type FactoryConditionCreateRq =
  components["schemas"]["FactoryConditionCreateRqV1"];

export type FactoryConditionUpdateRq =
  components["schemas"]["FactoryConditionUpdateRqV1"];
