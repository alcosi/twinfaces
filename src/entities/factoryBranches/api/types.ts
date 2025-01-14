import { components } from "@/shared/api/generated/schema";

export type FactoryBranches = components["schemas"]["FactoryBranchV2"];
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
