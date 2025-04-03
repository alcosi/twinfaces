import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { useUserSelectAdapter } from "@/entities/user";
import {
  type FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { TwinFlowFilterKeys, TwinFlowFilters } from "../../api";

type FilterKeys = Exclude<TwinFlowFilterKeys, "twinClassIdMap">;

export function useTwinFlowFilters(): FilterFeature<
  FilterKeys,
  TwinFlowFilters
> {
  const twinStatusAdapter = useTwinStatusSelectAdapter();
  const userAdapter = useUserSelectAdapter();

  function buildFilterFields(): Record<FilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
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
      },
      createdByUserIdList: {
        type: AutoFormValueType.combobox,
        label: "Created by",
        selectPlaceholder: "Select user...",
        multi: true,
        ...userAdapter,
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FilterKeys, unknown>
  ): TwinFlowFilters {
    const result: TwinFlowFilters = {
      idList: toArrayOfString(filters.idList, "id"),
      nameI18nLikeList: toArrayOfString(toArray(filters.nameI18nLikeList)).map(
        wrapWithPercent
      ),
      descriptionI18nLikeList: toArrayOfString(
        toArray(filters.descriptionI18nLikeList)
      ).map(wrapWithPercent),
      initialStatusIdList: toArrayOfString(filters.initialStatusIdList, "id"),
      createdByUserIdList: toArrayOfString(filters.createdByUserIdList, "id"),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
