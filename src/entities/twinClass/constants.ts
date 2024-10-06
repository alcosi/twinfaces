import {AutoFormValueType} from "@/components/auto-field";

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

export const FILTERS = {
    [FilterFields.twinClassIdList]: {
        type: AutoFormValueType.multiSelect,
        label: "Id",
        defaultValue: [],
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
        type: AutoFormValueType.multiSelect,
        label: "Head twins",
        defaultValue: [],
    },
    [FilterFields.extendsTwinClassIdList]: {
        type: AutoFormValueType.multiSelect,
        label: "Extends twins",
        defaultValue: [],
    },
    [FilterFields.ownerTypeList]: {
        type: AutoFormValueType.multiSelect,
        label: "Owner types",
        options: OWNER_TYPES?.map(type => ({ id: type, name: type })),
        defaultValue: [],
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
