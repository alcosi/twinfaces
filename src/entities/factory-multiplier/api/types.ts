import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type FactoryMultiplier = components["schemas"]["FactoryMultiplierV2"];
export type FactoryMultiplier_DETAILED = RequireFields<
  FactoryMultiplier,
  "id" | "factory" | "inputTwinClass" | "active" | "description"
>;

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
