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
export type FactoryBranchesSearchRq =
  components["schemas"]["FactoryBranchSearchRqV1"];

export type FactoryBranchesFilterKeys =
  | "idList"
  | "idExcludeList"
  | "factoryIdList"
  | "factoryIdExcludeList"
  | "factoryConditionSetIdList"
  | "factoryConditionSetIdExcludeList"
  | "nextFactoryIdList"
  | "nextFactoryIdExcludeList"
  | "active";

export type FactoryBranchesFilters = Partial<
  Pick<FactoryBranchesSearchRq, FactoryBranchesFilterKeys>
>;
