import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Factory = components["schemas"]["FactoryV2"];
export type Factory_SHORT = RequireFields<
  Factory,
  "id" | "name" | "key" | "createdAt"
>;
export type Factory_DETAILED = RequireFields<
  Factory_SHORT,
  | "factoryBranchesCount"
  | "factoryErasersCount"
  | "factoryMultipliersCount"
  | "factoryPipelinesCount"
  | "factoryUsagesCount"
>;
export type FactorySearchRq = components["schemas"]["FactorySearchRqV1"];
export type FactoryViewhQuery =
  operations["factoryViewV1"]["parameters"]["query"];
export type FactoryUpdateRq = components["schemas"]["FactoryUpdateRqV1"];
export type FactoryCreateRq = components["schemas"]["FactoryCreateRqV1"];

export type FactoryFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "keyLikeList";

export type FactoryFilters = Partial<Pick<FactorySearchRq, FactoryFilterKeys>>;
