import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { PermissionGroupFilterKeys, PermissionGroupFilters } from "../../api";

export function usePermissionGroupFilters(): FilterFeature<
  PermissionGroupFilterKeys,
  PermissionGroupFilters
> {
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  function buildFilterFields(): Record<
    PermissionGroupFilterKeys,
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
      twinClassIdList: {
        type: AutoFormValueType.complexCombobox,
        label: "Class",
        adapter: twinClassAdapter,
        extraFilters: buildTwinClassFilters(),
        mapExtraFilters: (filters) => mapTwinClassFilters(filters),
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...",
        multi: true,
      },
      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
    } as const;
  }

  function mapFiltersToPayload(
    filters: Record<PermissionGroupFilterKeys, unknown>
  ): PermissionGroupFilters {
    const result: PermissionGroupFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      keyLikeList: toArrayOfString(toArray(filters.keyLikeList), "key").map(
        wrapWithPercent
      ),
      twinClassIdList: toArrayOfString(filters.twinClassIdList, "id"),
      nameLikeList: toArrayOfString(toArray(filters.nameLikeList), "name").map(
        wrapWithPercent
      ),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList)
      ).map(wrapWithPercent),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
