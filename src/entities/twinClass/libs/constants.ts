import { AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";

export const OWNER_TYPES = [
  "SYSTEM",
  "USER",
  "BUSINESS_ACCOUNT",
  "DOMAIN",
  "DOMAIN_BUSINESS_ACCOUNT",
  "DOMAIN_USER",
  "DOMAIN_BUSINESS_ACCOUNT_USER",
] as const;

export enum FilterFields {
  twinClassIdList = "twinClassIdList",
  twinClassKeyLikeList = "twinClassKeyLikeList",
  nameI18nLikeList = "nameI18nLikeList",
  descriptionI18nLikeList = "descriptionI18nLikeList",
  headTwinClassIdList = "headTwinClassIdList",
  extendsTwinClassIdList = "extendsTwinClassIdList",
  ownerTypeList = "ownerTypeList",
  twinflowSchemaSpace = "twinflowSchemaSpace",
  twinClassSchemaSpace = "twinClassSchemaSpace",
  permissionSchemaSpace = "permissionSchemaSpace",
  aliasSpace = "aliasSpace",
  abstractt = "abstractt",
}

// export const FILTERS: Record<FilterFields, AutoFormValueInfo> = {
export const FILTERS = {
  [FilterFields.twinClassIdList]: {
    type: AutoFormValueType.uuid,
    label: "Id",
  },
  [FilterFields.twinClassKeyLikeList]: {
    type: AutoFormValueType.string,
    label: "Key",
  },
  [FilterFields.nameI18nLikeList]: {
    type: AutoFormValueType.string,
    label: "Name",
  },
  [FilterFields.descriptionI18nLikeList]: {
    type: AutoFormValueType.string,
    label: "Description",
  },
  [FilterFields.headTwinClassIdList]: {
    type: AutoFormValueType.combobox,
    label: "Head",
    multi: true,
  },
  [FilterFields.extendsTwinClassIdList]: {
    type: AutoFormValueType.combobox,
    label: "Extends",
    multi: true,
  },
  [FilterFields.ownerTypeList]: {
    type: AutoFormValueType.combobox,
    label: "Owner types",
    getById: async (key: string) => OWNER_TYPES?.find((o) => o === key),
    getItems: async (needle: string) => {
      return OWNER_TYPES?.filter((type) =>
        type.toLowerCase().includes(needle.toLowerCase())
      );
    },
    getItemKey: (o: string) => o,
    getItemLabel: (o: string) => o,
    multi: true,
  },
  [FilterFields.twinflowSchemaSpace]: {
    type: AutoFormValueType.boolean,
    label: "Twinflow schema space",
    hasIndeterminate: true,
    defaultValue: "indeterminate",
  },
  [FilterFields.twinClassSchemaSpace]: {
    type: AutoFormValueType.boolean,
    label: "Twinclass schema space",
    hasIndeterminate: true,
    defaultValue: "indeterminate",
  },
  [FilterFields.permissionSchemaSpace]: {
    type: AutoFormValueType.boolean,
    label: "Permission schema space",
    hasIndeterminate: true,
    defaultValue: "indeterminate",
  },
  [FilterFields.aliasSpace]: {
    type: AutoFormValueType.boolean,
    label: "Alias space",
    hasIndeterminate: true,
    defaultValue: "indeterminate",
  },
  [FilterFields.abstractt]: {
    type: AutoFormValueType.boolean,
    label: "Abstract",
    hasIndeterminate: true,
    defaultValue: "indeterminate",
  },
} as const;

export const TWIN_CLASSES_SCHEMA = z.object({
  key: z
    .string()
    .min(1)
    .max(100)
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Key can only contain latin letters, numbers, underscores and dashes"
    ),
  name: z.string().min(1).max(100),
  description: z
    .string()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  abstractClass: z.boolean(),
  headHunterFeaturerId: z.number(),
  headHunterParams: z.record(z.string(), z.any()).optional(),
  headTwinClassId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  extendsTwinClassId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  logo: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  permissionSchemaSpace: z.boolean(),
  twinflowSchemaSpace: z.boolean(),
  twinClassSchemaSpace: z.boolean(),
  aliasSpace: z.boolean(),
  markerDataListId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  tagDataListId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  viewPermissionId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
});
