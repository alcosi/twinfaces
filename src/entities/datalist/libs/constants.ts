import { AutoFormValueType } from "@/components/auto-field";

export enum FilterFields {
  idList = "idList",
  nameLikeList = "nameLikeList",
  descriptionLikeList = "descriptionLikeList",
  keyLikeList = "keyLikeList",
}

export const FILTERS = {
  [FilterFields.idList]: {
    type: AutoFormValueType.string,
    label: "ID",
  },
  [FilterFields.nameLikeList]: {
    type: AutoFormValueType.string,
    label: "Name",
  },
  [FilterFields.descriptionLikeList]: {
    type: AutoFormValueType.string,
    label: "Description",
  },
  [FilterFields.keyLikeList]: {
    type: AutoFormValueType.string,
    label: "Key",
  },
} as const;
