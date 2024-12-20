import { components } from "@/shared/api/generated/schema";

export type Factory = components["schemas"]["FactoryV2"];
export type FactorySearchRq = components["schemas"]["FactorySearchRqV1"];

export type FactoryFilterKeys =
  | "idList"
  | "nameLikeList"
  | "descriptionLikeList"
  | "keyLikeList";

export type FactoryFilters = Partial<Pick<FactorySearchRq, FactoryFilterKeys>>;
