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
    twinClassIdExcludeList = "twinClassIdExcludeList",
    twinNameLikeList = "twinNameLikeList",
    headTwinIdList = "headTwinIdList",
    twinIdList = "id",
    twinIdExcludeList = "twinIdExcludeList",
    statusIdList = "statusIdList",
    assignerUserIdList = "assignerUserIdList",
    assignerUserIdExcludeList = "assignerUserIdExcludeList",
    createdByUserIdList = "createdByUserIdList",
    createdByUserIdExcludeList = "createdByUserIdList",
    linksAnyOfList = "linksAnyOfList",
    linksNoAnyOfList = "linksNoAnyOfList",
    linksAllOfList = "linksAllOfList",
    linksNoAllOfList = "linksNoAllOfList",
    hierarchyTreeContainsIdList = "hierarchyTreeContainsIdList",
    statusIdExcludeList = "statusIdExcludeList",
    tagDataListOptionIdList = "tagDataListOptionIdList",
    tagDataListOptionIdExcludeList = "tagDataListOptionIdList",
    markerDataListOptionIdList = "markerDataListOptionIdList",
    markerDataListOptionIdExcludeList = "markerDataListOptionIdExcludeList",
    extendsTwinClassIdList = "extendsTwinClassIdList",
    headTwinClassIdList = "headTwinClassIdList",
    touchList = "touchList",
    touchExcludeList = "touchExcludeList",
    headSearch = "headSearch",
}

export const FILTERS = {
    [FilterFields.twinIdList]: {
        type: AutoFormValueType.string,
        label: "Id"
    },
    [FilterFields.twinNameLikeList]: {
        type: AutoFormValueType.string,
        label: "Name"
    },
    [FilterFields.twinClassIdList]: {
        type: AutoFormValueType.string,
        label: "Twin Class Id"
    },
    [FilterFields.assignerUserIdList]: {
        type: AutoFormValueType.string,
        label: "Assigner User Id"
    },
}