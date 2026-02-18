import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { RecipientFilterKeys, RecipientFilters } from "@/entities/recipient";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArrayOfString,
} from "@/shared/libs";

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
    const result: RecipientFilters = {};

    if (filters.idList) {
      result.idList = toArrayOfString(filters.idList);
    }

    if (filters.nameLikeList) {
      const names = toArrayOfString(filters.nameLikeList);
      result.nameLikeList = names.map((name) => `%${name}%`);
    }

    if (filters.descriptionLikeList) {
      const descriptions = toArrayOfString(filters.descriptionLikeList);
      result.descriptionLikeList = descriptions.map((desc) => `%${desc}%`);
    }

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
