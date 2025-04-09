import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  type FilterFeature,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { DomainUserFilterKeys, DomainUserFilters } from "../../api";

export function useUserFilters(): FilterFeature<
  DomainUserFilterKeys,
  DomainUserFilters
> {
  function buildFilterFields(): Record<
    Exclude<DomainUserFilterKeys, "businessAccountIdList">,
    AutoFormValueInfo
  > {
    return {
      userIdList: {
        type: AutoFormValueType.tag,
        label: "User Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      emailLikeList: {
        type: AutoFormValueType.tag,
        label: "Email",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<DomainUserFilterKeys, unknown>
  ): DomainUserFilters {
    return {
      userIdList: toArrayOfString(filters.userIdList),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      emailLikeList: toArrayOfString(filters.emailLikeList).map(
        wrapWithPercent
      ),
    };
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
