import { AutoFormValueType } from "@/components/auto-field";

export enum FilterFields {
  dataListIdList = "dataListIdList",
}

export const FILTERS = {
  [FilterFields.dataListIdList]: {
    type: AutoFormValueType.string,
    label: "ID",
  },
} as const;
