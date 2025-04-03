import { components } from "@/shared/api/generated/schema";

export type FactoryMultiplierFilter =
  components["schemas"]["FactoryMultiplierFilterV2"];
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
