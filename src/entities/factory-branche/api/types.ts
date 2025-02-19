import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type FactoryBranche = components["schemas"]["FactoryBranchV2"];
export type FactoryBranche_SHORT = RequireFields<
  FactoryBranche,
  "id" | "factoryId" | "factory" | "factoryConditionSetInvert" | "active"
>;
export type FactoryBranche_DETAILED = RequireFields<
  FactoryBranche_SHORT,
  | "description"
  | "factoryConditionSetId"
  | "factoryConditionSet"
  | "nextFactoryId"
  | "nextFactory"
>;

export type FactoryBranchSearchRq =
  components["schemas"]["FactoryBranchSearchRqV1"];
export type FactoryBrancheCreateRq =
  components["schemas"]["FactoryBranchCreateRqV1"];

export type FactoryBranchFilterKeys =
  | "idList"
  | "factoryIdList"
  | "active"
  | "descriptionLikeList"
  | "nextFactoryIdList"
  | "factoryConditionSetIdList"
  | "conditionInvert";

export type FactoryBranchFilters = Partial<
  Pick<FactoryBranchSearchRq, FactoryBranchFilterKeys>
>;
