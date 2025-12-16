import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import {
  ERASE_ACTION_TYPES,
  FactoryEraserFilterKeys,
  FactoryEraserFilters,
} from "@/entities/factory-eraser";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  FilterFeature,
  createFixedSelectAdapter,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

export function useFactoryEraserFilters(): FilterFeature<
  FactoryEraserFilterKeys,
  FactoryEraserFilters
> {
  const factoryAdapter = useFactorySelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  function buildFilterFields(): Record<
    FactoryEraserFilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "ID",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },

      factoryIdList: {
        type: AutoFormValueType.combobox,
        label: "Factory",
        multi: true,
        ...factoryAdapter,
      },

      inputTwinClassIdList: {
        type: AutoFormValueType.complexCombobox,
        label: "Input class",
        adapter: twinClassAdapter,
        extraFilters: buildTwinClassFilters(),
        mapExtraFilters: (filters) => mapTwinClassFilters(filters),
        searchPlaceholder: "Search...",
        selectPlaceholder: "Select...",
        multi: true,
      },

      factoryConditionSetIdList: {
        type: AutoFormValueType.combobox,
        label: "Condition set",
        multi: true,
        ...factoryConditionSetAdapter,
      },

      conditionInvert: {
        type: AutoFormValueType.boolean,
        label: "Condition invert",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },

      active: {
        type: AutoFormValueType.boolean,
        label: "Active",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },

      eraseActionLikeList: {
        type: AutoFormValueType.combobox,
        label: "Erase action",
        ...createFixedSelectAdapter(ERASE_ACTION_TYPES),
        multi: true,
      },

      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FactoryEraserFilterKeys, unknown>
  ): FactoryEraserFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
      inputTwinClassIdList: toArrayOfString(filters.inputTwinClassIdList, "id"),
      factoryConditionSetIdList: toArrayOfString(
        filters.factoryConditionSetIdList,
        "id"
      ),
      conditionInvert: mapToChoice(filters.conditionInvert),
      active: mapToChoice(filters.active),
      eraseActionLikeList: toArray(
        filters.eraseActionLikeList as FactoryEraserFilters["eraseActionLikeList"]
      ),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
