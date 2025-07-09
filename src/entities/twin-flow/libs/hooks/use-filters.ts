import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twin-class";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { useUserSelectAdapter } from "@/entities/user";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  reduceToObject,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { TwinFlowFilterKeys, TwinFlowFilters } from "../../api";

export function useTwinFlowFilters({
  twinClassId,
  enabledFilters,
}: {
  twinClassId?: string;
  enabledFilters?: TwinFlowFilterKeys[];
}): FilterFeature<TwinFlowFilterKeys, TwinFlowFilters> {
  const twinStatusAdapter = useTwinStatusSelectAdapter();
  const userAdapter = useUserSelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();

  const allFilters: Record<TwinFlowFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinClassIdMap: {
      type: AutoFormValueType.combobox,
      label: "Class",
      multi: true,
      ...twinClassAdapter,
    },
    nameI18nLikeList: {
      type: AutoFormValueType.string,
      label: "Name",
    },
    descriptionI18nLikeList: {
      type: AutoFormValueType.string,
      label: "Description",
    },
    initialStatusIdList: {
      type: AutoFormValueType.combobox,
      label: "Initial status",
      selectPlaceholder: "Select statuses...",
      multi: true,
      ...twinStatusAdapter,
      getItems: async (search: string) =>
        twinStatusAdapter.getItems(search, {
          twinClassIdMap: reduceToObject({
            list: toArray(twinClassId),
            defaultValue: true,
          }),
        }),
    },
    createdByUserIdList: {
      type: AutoFormValueType.combobox,
      label: "Created by",
      selectPlaceholder: "Select user...",
      multi: true,
      ...userAdapter,
    },
  };

  function buildFilterFields(): Record<TwinFlowFilterKeys, AutoFormValueInfo> {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinFlowFilterKeys, unknown>
  ): TwinFlowFilters {
    const result: TwinFlowFilters = {
      idList: toArrayOfString(filters.idList, "id"),
      twinClassIdMap: reduceToObject({
        list: toArray(filters.twinClassIdMap) as TwinClass_DETAILED[],
        defaultValue: true,
      }),
      nameI18nLikeList: toArrayOfString(toArray(filters.nameI18nLikeList)).map(
        wrapWithPercent
      ),
      descriptionI18nLikeList: toArrayOfString(
        toArray(filters.descriptionI18nLikeList)
      ).map(wrapWithPercent),
      initialStatusIdList: toArrayOfString(filters.initialStatusIdList, "id"),
      createdByUserIdList: toArrayOfString(
        filters.createdByUserIdList,
        "userId"
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
