import { FactoryConditionSet } from "@/entities/factory-condition-set";
import { FactoryMultiplier } from "@/entities/factory-multiplier";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { components } from "@/shared/api/generated/schema";

export type FactoryMultiplierFilter =
  components["schemas"]["FactoryMultiplierFilterV1"] & {
    multiplier?: FactoryMultiplier;
    inputTwinClass?: TwinClass_DETAILED;
    factoryConditionSet?: FactoryConditionSet;
  };
export type FactoryMultiplierFilter_DETAILED =
  Required<FactoryMultiplierFilter>;

export type FactoryMultiplierFilterSearchRq =
  components["schemas"]["FactoryMultiplierFilterSearchRqV1"];

export type FactoryMultiplierFilterFilterKeys =
  | "idList"
  | "factoryIdList"
  | "factoryMultiplierIdList"
  | "inputTwinClassIdList"
  | "factoryConditionSetIdList"
  | "active"
  | "descriptionLikeList"
  | "factoryConditionInvert";

export type FactoryMultiplierFilterFilters = Partial<
  Pick<FactoryMultiplierFilterSearchRq, FactoryMultiplierFilterFilterKeys>
>;
