import { DataList } from "@/entities/datalist";
import { DataListOptionV1 } from "@/entities/datalist-option";
import { ProjectionType } from "@/entities/projection";
import { User } from "@/entities/user";
import { components } from "@/shared/api/generated/schema";

export type OptionProjection =
  components["schemas"]["DataListOptionProjectionV1"] & {
    projectionType?: ProjectionType;
    savedByUser?: User;
    srcDataListOption?: DataListOptionV1;
    srcDataList?: DataList;
    dstDataListOption?: DataListOptionV1;
    dstDataList?: DataList;
    dstDataListId?: string;
    srcDataListId?: string;
  };

export type OptionProjection_DETAILED = Required<OptionProjection>;
export type OptionProjectionSearchRq =
  components["schemas"]["DataListOptionProjectionSearchV1"];

export type OptionProjectionFilterKeys =
  | "idList"
  | "projectionTypeIdList"
  | "srcDataListOptionIdList"
  | "dstDataListOptionIdList"
  | "savedByUserIdList"
  | "changedAt";

export type optionProjectionFilters = Partial<
  Pick<OptionProjectionSearchRq, OptionProjectionFilterKeys>
>;
