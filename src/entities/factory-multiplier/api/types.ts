import { components } from "@/shared/api/generated/schema";

export type FactoryMultiplier = components["schemas"]["FactoryMultiplierV2"];
export type FactoryMultiplier_DETAILED = Required<FactoryMultiplier>;

export type FactoryMultiplierSearchRq =
  components["schemas"]["FactoryMultiplierSearchRqV1"];

export type FactoryMultiplierFilterKeys =
  | "idList"
  | "factoryIdList"
  | "inputTwinClassIdList"
  | "multiplierFeaturerIdList"
  | "active"
  | "descriptionLikeList";

export type FactoryMultiplierFilters = Partial<
  Pick<FactoryMultiplierSearchRq, FactoryMultiplierFilterKeys>
>;
