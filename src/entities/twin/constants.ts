import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

const OWNER_TYPES = [
  "SYSTEM",
  "USER",
  "BUSINESS_ACCOUNT",
  "DOMAIN",
  "DOMAIN_BUSINESS_ACCOUNT",
  "DOMAIN_USER",
  "DOMAIN_BUSINESS_ACCOUNT_USER",
] as const;

export enum FilterFields {
  twinIdList = "twinIdList",
  twinClassIdList = "twinClassIdList",
  statusIdList = "statusIdList",
  twinNameLikeList = "twinNameLikeList",
  createdByUserIdList = "createdByUserIdList",
  assignerUserIdList = "assignerUserIdList",
  headTwinIdList = "headTwinIdList",
  tagDataListOptionIdList = "tagDataListOptionIdList",
  markerDataListOptionIdList = "markerDataListOptionIdList",
}

export const FILTERS = {
  [FilterFields.twinIdList]: {
    type: AutoFormValueType.string,
    label: "ID",
  },
  [FilterFields.twinClassIdList]: {
    type: AutoFormValueType.multiCombobox,
    label: "Twin Class",
  },
  [FilterFields.statusIdList]: {
    type: AutoFormValueType.multiCombobox,
    label: "Status",
  },
  [FilterFields.twinNameLikeList]: {
    type: AutoFormValueType.string,
    label: "Name",
  },
  [FilterFields.createdByUserIdList]: {
    type: AutoFormValueType.string,
    label: "Author",
  },
  [FilterFields.assignerUserIdList]: {
    type: AutoFormValueType.string,
    label: "Assigner",
  },
  [FilterFields.headTwinIdList]: {
    type: AutoFormValueType.multiCombobox,
    label: "Head",
  },
  [FilterFields.tagDataListOptionIdList]: {
    type: AutoFormValueType.string,
    label: "Tags",
  },
  [FilterFields.markerDataListOptionIdList]: {
    type: AutoFormValueType.string,
    label: "Markers",
  },
} as const;
