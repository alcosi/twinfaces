import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { z } from "zod";
import { UserGroupFilterKeys, UserGroupFilters } from "@/entities/userGroup";

export function useUserGroupsFilters(): FilterFeature<
  UserGroupFilterKeys,
  UserGroupFilters
> {
  function buildFilterFields(): Record<UserGroupFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },

      nameI18NLikeList: {
        type: AutoFormValueType.string,
        label: "Name",
      },

      descriptionI18NLikeList: {
        type: AutoFormValueType.string,
        label: "Description",
      },
    } as const;
  }

  function mapFiltersToPayload(
    filters: Record<UserGroupFilterKeys, unknown>
  ): UserGroupFilters {
    const result: UserGroupFilters = {
      idList: toArrayOfString(filters.idList),
      nameI18NLikeList: toArrayOfString(
        toArray(filters.nameI18NLikeList),
        "name"
      ).map(wrapWithPercent),
      descriptionI18NLikeList: toArrayOfString(
        toArray(filters.descriptionI18NLikeList),
        "description"
      ).map(wrapWithPercent),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
