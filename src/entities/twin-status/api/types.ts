import { TwinClass } from "@/entities/twin-class";
import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinStatus = components["schemas"]["TwinStatusV1"];
export type TwinStatus_DETAILED = RequireFields<TwinStatus, "twinClassId"> & {
  twinClass: TwinClass;
};

export type TwinStatusCreateRq = components["schemas"]["TwinStatusCreateRqV1"];
export type TwinStatusUpdateRq = components["schemas"]["TwinStatusUpdateRqV1"];

export type TwinStatusFilterKeys =
  | "idList"
  | "twinClassIdList"
  | "keyLikeList"
  | "nameI18nLikeList"
  | "descriptionI18nLikeList";

export type TwinStatusFilters = Partial<
  Pick<components["schemas"]["TwinStatusSearchRqV1"], TwinStatusFilterKeys>
>;
