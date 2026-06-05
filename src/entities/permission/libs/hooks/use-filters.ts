import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { usePermissionGroupSelectAdapterWithFilters } from "@/entities/permission-group";
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
  const pgAdapter = usePermissionGroupSelectAdapterWithFilters();

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
        type: AutoFormValueType.complexCombobox,
        label: "Permission Groups",
        adapter: pgAdapter,
        // NOTE: extraFilters intentionally empty to break the recursive filter
        // cycle twinClass -> permission -> permission-group -> twinClass.
        // (usePermissionGroupFilters nests a twin-class complexCombobox, and
        // twin-class filters nest permission complexComboboxes.)
        extraFilters: {},
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...",
        multi: true,
      },
    };
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
