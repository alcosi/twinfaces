import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

export enum FilterFields {
  twinIdList = "twinIdList",
  twinNameLikeList = "twinNameLikeList",
  statusIdList = "statusIdList",
  assignerUserIdList = "assignerUserIdList",
  twinClassIdList = "twinClassIdList",
}

export const FILTERS: Record<FilterFields, AutoFormValueInfo> = {
  [FilterFields.twinIdList]: {
    type: AutoFormValueType.string,
    label: "Id",
  },
  [FilterFields.twinNameLikeList]: {
    type: AutoFormValueType.string,
    label: "name",
  },
  [FilterFields.statusIdList]: {
    type: AutoFormValueType.string,
    label: "Status",
  },
  [FilterFields.assignerUserIdList]: {
    type: AutoFormValueType.string,
    label: "assignerUserId",
  },
  [FilterFields.twinClassIdList]: {
    type: AutoFormValueType.string,
    label: "twinClassId",
  },
};
