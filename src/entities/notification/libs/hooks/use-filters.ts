import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { RecipientFilterKeys, RecipientFilters } from "../../api";

export function useRecipientFilters({
  enabledFilters,
}: {
  enabledFilters?: RecipientFilterKeys[];
} = {}): FilterFeature<RecipientFilterKeys, RecipientFilters> {
  const allFilters: Record<RecipientFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    nameLikeList: {
      type: AutoFormValueType.tag,
      label: "Name",
      placeholder: "Search by name...",
    },
    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
      placeholder: "Search by description...",
    },
  };

  function buildFilterFields(): Record<RecipientFilterKeys, AutoFormValueInfo> {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<RecipientFilterKeys, unknown>
  ): RecipientFilters {
    return {
      idList: toArrayOfString(filters.idList),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      descriptionLikeList: toArrayOfString(filters.descriptionLikeList).map(
        wrapWithPercent
      ),
    };
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
