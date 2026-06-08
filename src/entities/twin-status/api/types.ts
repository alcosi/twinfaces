import { TwinClass_DETAILED } from "@/entities/twin-class";
import { components } from "@/shared/api/generated/schema";

export type TwinStatus = components["schemas"]["TwinStatusV1"];
export type TwinStatus_DETAILED = Required<TwinStatus> & {
  twinClass: TwinClass_DETAILED;
};

export type TwinStatusCreateRq = components["schemas"]["TwinStatusCreateRqV1"];
export type TwinStatusUpdateRq = components["schemas"]["TwinStatusUpdateRqV1"];
export type TwinStatusDuplicateRq =
  components["schemas"]["TwinStatusDuplicateRqV1"];
export type TwinStatusExportSqlRq =
  components["schemas"]["TwinStatusExportSqlRqV1"];

export type TwinStatusFilterKeys =
  | "idList"
  | "twinClassIdMap"
  | "keyLikeList"
  | "nameI18nLikeList"
  | "descriptionI18nLikeList";

export type TwinStatusFilters = Partial<
  Pick<components["schemas"]["TwinStatusSearchRqV1"], TwinStatusFilterKeys>
>;

/** Fields the v2 search endpoint can sort by (by name, not id). */
export type TwinStatusSortField = NonNullable<
  components["schemas"]["TwinStatusSearchRqV2"]["sortField"]
>;

/** Fields the count endpoint can group by. */
export type TwinStatusCountGroupField = NonNullable<
  components["schemas"]["TwinStatusCountRqV1"]["groupFields"]
>[number];
