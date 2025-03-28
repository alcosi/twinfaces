import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { useFactoryMultiplierSelectAdapter } from "@/entities/factory-multiplier/libs";
import { useFactorySelectAdapter } from "@/entities/factory/libs";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import {
  FilterFeature,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  FactoryMultiplierFilterFilterKeys,
  FactoryMultiplierFilterFilters,
} from "../../api";

export function useFactoryMultiplierFilterFilters(): FilterFeature<
  FactoryMultiplierFilterFilterKeys,
  FactoryMultiplierFilterFilters
> {
  const factoryAdapter = useFactorySelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();
  const factoryMultiplierAdapter = useFactoryMultiplierSelectAdapter();

  function buildFilterFields(): Record<
    FactoryMultiplierFilterFilterKeys,
    AutoFormValueInfo
  > {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      factoryIdList: {
        type: AutoFormValueType.combobox,
        label: "Factory",
        multi: true,
        ...factoryAdapter,
      },
      factoryMultiplierIdList: {
        type: AutoFormValueType.combobox,
        label: "Multiplier",
        multi: true,
        ...factoryMultiplierAdapter,
      },
      inputTwinClassIdList: {
        type: AutoFormValueType.combobox,
        label: "Input class",
        multi: true,
        ...twinClassAdapter,
      },
      factoryConditionSetIdList: {
        type: AutoFormValueType.combobox,
        label: "Condition set",
        multi: true,
        ...factoryConditionSetAdapter,
      },
      factoryConditionInvert: {
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
      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FactoryMultiplierFilterFilterKeys, unknown>
  ): FactoryMultiplierFilterFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
      factoryMultiplierIdList: toArrayOfString(
        filters.factoryMultiplierIdList,
        "id"
      ),
      inputTwinClassIdList: toArrayOfString(filters.inputTwinClassIdList, "id"),
      factoryConditionSetIdList: toArrayOfString(
        filters.factoryConditionSetIdList,
        "id"
      ),
      factoryConditionInvert: mapToChoice(filters.factoryConditionInvert),
      active: mapToChoice(filters.active),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
