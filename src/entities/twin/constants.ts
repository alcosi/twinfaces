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
    twinIdList = "id",
    twinClassIdList = "twinClassId",
    twinNameLikeList = "name",
    assignerUserIdList = "assignerUserId",
    // twinClassIdExcludeList = "twinClassIdExcludeList",
    // headTwinIdList = "headTwinIdList",
    // twinIdExcludeList = "twinIdExcludeList",
    // statusIdList = "statusIdList",
    // assignerUserIdExcludeList = "assignerUserIdExcludeList",
    // createdByUserIdList = "createdByUserIdList",
    // createdByUserIdExcludeList = "createdByUserIdList",
    // linksAnyOfList = "linksAnyOfList",
    // linksNoAnyOfList = "linksNoAnyOfList",
    // linksAllOfList = "linksAllOfList",
    // linksNoAllOfList = "linksNoAllOfList",
    // hierarchyTreeContainsIdList = "hierarchyTreeContainsIdList",
    // statusIdExcludeList = "statusIdExcludeList",
    // tagDataListOptionIdList = "tagDataListOptionIdList",
    // tagDataListOptionIdExcludeList = "tagDataListOptionIdList",
    // markerDataListOptionIdList = "markerDataListOptionIdList",
    // markerDataListOptionIdExcludeList = "markerDataListOptionIdExcludeList",
    // extendsTwinClassIdList = "extendsTwinClassIdList",
    // headTwinClassIdList = "headTwinClassIdList",
    // touchList = "touchList",
    // touchExcludeList = "touchExcludeList",
    // headSearch = "headSearch",
}

export const FILTERS: Record<FilterFields, AutoFormValueInfo>  = {
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

