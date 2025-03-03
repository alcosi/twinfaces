import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { usePermissionGroupSelectAdapter } from "@/entities/permission-group";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { PermissionFilterKeys, PermissionFilters } from "../../api";

export function usePermissionFilters(): FilterFeature<
  PermissionFilterKeys,
  PermissionFilters
> {
  const pgAdapter = usePermissionGroupSelectAdapter();

  function buildFilterFields(): Record<
    PermissionFilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      keyLikeList: {
        type: AutoFormValueType.tag,
        label: "Key",
      },
      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
      groupIdList: {
        type: AutoFormValueType.combobox,
        label: "Permission Groups",
        multi: true,
        ...pgAdapter,
      },
    } as const;
  }

  function mapFiltersToPayload(
    filters: Record<PermissionFilterKeys, unknown>
  ): PermissionFilters {
    const result: PermissionFilters = {
      idList: toArrayOfString(filters.idList),
      keyLikeList: toArrayOfString(filters.keyLikeList).map(wrapWithPercent),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList)
      ).map(wrapWithPercent),
      groupIdList: toArrayOfString(filters.groupIdList, "id"),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
