import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  type FilterFeature,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { DomainUserFilterKeys, DomainUserFilters } from "../../api";

type Keys = Extract<DomainUserFilterKeys, "userIdList" | "nameLikeList">;
type Filters = Pick<DomainUserFilters, "userIdList" | "nameLikeList">;

export function useUserFilters(): FilterFeature<Keys, Filters> {
  function buildFilterFields(): Record<Keys, AutoFormValueInfo> {
    return {
      userIdList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },

      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
    } as const;
  }

  function mapFiltersToPayload(filters: Record<Keys, unknown>): Filters {
    const result: DomainUserFilters = {
      userIdList: toArrayOfString(filters.userIdList),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
