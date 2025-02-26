import { components, operations } from "@/shared/api/generated/schema";

export type FactoryMultiplier = components["schemas"]["FactoryMultiplierV2"];
export type FactoryMultiplier_DETAILED = Required<FactoryMultiplier>;

export type FactoryMultiplierSearchRq =
  components["schemas"]["FactoryMultiplierSearchRqV1"];
export type FactoryMultiplierViewQuery =
  operations["factoryMultiplierViewV1"]["parameters"]["query"];
export type FactoryMultiplierUpdateRq =
  components["schemas"]["FactoryMultiplierUpdateRqV1"];

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
