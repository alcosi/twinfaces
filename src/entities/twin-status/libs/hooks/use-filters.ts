import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  TwinStatusFilterKeys,
  TwinStatusFilters,
} from "@/entities/twin-status";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import {
  type FilterFeature,
  isPopulatedArray,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { z } from "zod";

export function useStatusFilters({
  enabledFilters,
}: {
  enabledFilters?: TwinStatusFilterKeys[];
}): FilterFeature<TwinStatusFilterKeys, TwinStatusFilters> {
  const tcAdapter = useTwinClassSelectAdapter();

  const allFilters: Record<TwinStatusFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },

    twinClassIdList: {
      type: AutoFormValueType.combobox,
      label: "Class",
      multi: true,
      ...tcAdapter,
    },

    keyLikeList: {
      type: AutoFormValueType.tag,
      label: "Key",
    },

    nameI18nLikeList: {
      type: AutoFormValueType.tag,
      label: "Name",
    },

    descriptionI18nLikeList: {
      type: AutoFormValueType.string,
      label: "Description",
    },
  };

  function buildFilterFields(): Record<
    TwinStatusFilterKeys,
    AutoFormValueInfo
  > {
    if (isPopulatedArray(enabledFilters)) {
      return enabledFilters.reduce(
        (filters, key) => {
          filters[key] = allFilters[key];
          return filters;
        },
        {} as Record<TwinStatusFilterKeys, AutoFormValueInfo>
      );
    }

    return allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinStatusFilterKeys, unknown>
  ): TwinStatusFilters {
    const result: TwinStatusFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      twinClassIdList: toArrayOfString(toArray(filters.twinClassIdList), "id"),
      keyLikeList: toArrayOfString(toArray(filters.keyLikeList), "key").map(
        wrapWithPercent
      ),
      nameI18nLikeList: toArrayOfString(filters.nameI18nLikeList).map(
        wrapWithPercent
      ),
      descriptionI18nLikeList: toArrayOfString(
        toArray(filters.descriptionI18nLikeList),
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
