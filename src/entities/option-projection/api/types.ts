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
};
export type OptionProjectionSearchRq =
  components["schemas"]["DataListOptionProjectionSearchV1"];

export type OptionProjectionFilterKeys =
  | "idList"
  | "projectionTypeIdList"
  | "srcDataListOptionIdList"
  | "dstDataListOptionIdList"
  | "savedByUserIdList"
  | "changedAtFrom"
  | "changedAtTo";

export type OptionProjectionFilters = Partial<
  Pick<
    OptionProjectionSearchRq & {
      changedAtFrom: string;
      changedAtTo: string;
    },
    OptionProjectionFilterKeys
  >
>;

export type OptionProjectionCreateRq =
  components["schemas"]["DataListOptionProjectionCreateRqV1"];

export type TitleOptionProjections = "Incoming" | "Outgoing";
