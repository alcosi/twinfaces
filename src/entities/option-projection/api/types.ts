import { DataList } from "@/entities/datalist";
import { DataListOptionV1 } from "@/entities/datalist-option";
import { ProjectionType } from "@/entities/projection";
import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";

export type OptionProjection =
  components["schemas"]["DataListOptionProjectionV1"];

export type OptionProjection_DETAILED = OptionProjection & {
  projectionType?: ProjectionType;
  savedByUser?: User;
  srcDataListOption?: DataListOptionV1;
  srcDataList?: DataList;
  dstDataListOption?: DataListOptionV1;
  dstDataList?: DataList;
  // dstDataListId?: string;
  // srcDataListId?: string;
};
export type OptionProjectionSearchRq =
  components["schemas"]["DataListOptionProjectionSearchV1"];

export type OptionProjectionFilterKeys =
  | "idList"
  | "projectionTypeIdList"
  | "srcDataListOptionIdList"
  | "dstDataListOptionIdList"
  | "savedByUserIdList"
  | "changedAt";

export type OptionProjectionFilters = Partial<
  Pick<OptionProjectionSearchRq, OptionProjectionFilterKeys>
>;

export type OptionProjectionCreateRq =
  components["schemas"]["DataListOptionProjectionCreateRqV1"];
