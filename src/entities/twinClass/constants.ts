import {AutoFormValueInfo, AutoFormValueType} from "@/components/auto-field";

const OWNER_TYPES = [
    "SYSTEM",
    "USER",
    "BUSINESS_ACCOUNT",
    "DOMAIN",
    "DOMAIN_BUSINESS_ACCOUNT",
    "DOMAIN_USER",
    "DOMAIN_BUSINESS_ACCOUNT_USER"
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
        type: AutoFormValueType.multiCombobox,
        label: "Head",
    },
    [FilterFields.extendsTwinClassIdList]: {
        type: AutoFormValueType.multiCombobox,
        label: "Extends",
    },
    [FilterFields.ownerTypeList]: {
        type: AutoFormValueType.multiCombobox,
        label: "Owner types",
        getById: async (key: string) => OWNER_TYPES?.find(o => o === key),
        getItems: async (needle: string) => {
            return OWNER_TYPES?.filter(type => type.toLowerCase().includes(needle.toLowerCase()))
        },
        getItemKey: (o: string) => o,
        getItemLabel: (o: string) => o,
        multi: true
    },
    [FilterFields.twinflowSchemaSpace]: {
        type: AutoFormValueType.boolean,
        label: "Twinflow schema space",
        hasIndeterminate: true,
        defaultValue: 'indeterminate',
    },
    [FilterFields.twinClassSchemaSpace]: {
        type: AutoFormValueType.boolean,
        label: "Twinclass schema space",
        hasIndeterminate: true,
        defaultValue: 'indeterminate',
    },
    [FilterFields.permissionSchemaSpace]: {
        type: AutoFormValueType.boolean,
        label: "Permission schema space",
        hasIndeterminate: true,
        defaultValue: 'indeterminate',
    },
    [FilterFields.aliasSpace]: {
        type: AutoFormValueType.boolean,
        label: "Alias space",
        hasIndeterminate: true,
        defaultValue: 'indeterminate',
    },
    [FilterFields.abstractt]: {
        type: AutoFormValueType.boolean,
        label: "Abstract",
        hasIndeterminate: true,
        defaultValue: 'indeterminate',
    }
} as const;
