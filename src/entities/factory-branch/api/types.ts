import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type FactoryBranch = components["schemas"]["FactoryBranchV2"];
export type FactoryBranch_SHORT = RequireFields<
  FactoryBranch,
  "id" | "factoryId" | "factory" | "factoryConditionSetInvert" | "active"
>;
export type FactoryBranch_DETAILED = RequireFields<
  FactoryBranch_SHORT,
  | "description"
  | "factoryConditionSetId"
  | "factoryConditionSet"
  | "nextFactoryId"
  | "nextFactory"
>;

export type FactoryBranchSearchRq =
  components["schemas"]["FactoryBranchSearchRqV1"];
export type FactoryBranchCreateRq =
  components["schemas"]["FactoryBranchCreateRqV1"];
export type FactoryBranchViewQuery =
  operations["factoryBranchViewV1"]["parameters"]["query"];
export type FactoryBranchUpdateRq =
  components["schemas"]["FactoryBranchUpdateRqv1"];

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
