import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory/libs";
import {
  FilterFeature,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  FactoryConditionSetFilterKeys,
  FactoryConditionSetFilters,
} from "../../api";

export function useFactoryConditionSetFilters(): FilterFeature<
  FactoryConditionSetFilterKeys,
  FactoryConditionSetFilters
> {
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();

  function buildFilterFields(): Record<
    FactoryConditionSetFilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      twinFactoryIdList: {
        type: AutoFormValueType.complexCombobox,
        label: "Factory",
        adapter: factoryAdapter,
        extraFilters: buildFactoryFilters(),
        mapExtraFilters: (filters) => mapFactoryFilters(filters),
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...",
        multi: true,
      },
      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      descriptionLikeList: {
        type: AutoFormValueType.string,
        label: "Description",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FactoryConditionSetFilterKeys, unknown>
  ): FactoryConditionSetFilters {
    return {
      idList: toArrayOfString(filters.idList),
      twinFactoryIdList: toArrayOfString(filters.twinFactoryIdList, "id"),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
