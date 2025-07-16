import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import {
  FactoryPipelineFilterKeys,
  FactoryPipelineFilters,
} from "@/entities/factory-pipeline";
import { useTwinClassSelectAdapter } from "@/entities/twin-class";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

export function useFactoryPipelineFilters({
  enabledFilters,
}: {
  enabledFilters?: FactoryPipelineFilterKeys[];
}): FilterFeature<FactoryPipelineFilterKeys, FactoryPipelineFilters> {
  const factorySelectAdapter = useFactorySelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const twinStatusAdapter = useTwinStatusSelectAdapter();
  const factoryConditionSetAdapter = useFactoryConditionSetSelectAdapter();

  const allFilters: Record<FactoryPipelineFilterKeys, AutoFormValueInfo> = {
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
      ...factorySelectAdapter,
    },
    inputTwinClassIdList: {
      type: AutoFormValueType.combobox,
      label: "Input Twin Class",
      multi: true,
      ...twinClassAdapter,
    },
    factoryConditionSetIdList: {
      type: AutoFormValueType.combobox,
      label: "Factory Condition Set",
      multi: true,
      ...factoryConditionSetAdapter,
    },
    active: {
      type: AutoFormValueType.boolean,
      label: "Active",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    outputTwinStatusIdList: {
      type: AutoFormValueType.combobox,
      label: "Output Twin Status",
      multi: true,
      ...twinStatusAdapter,
    },
    nextFactoryIdList: {
      type: AutoFormValueType.combobox,
      label: "Next Factory",
      multi: true,
      ...factorySelectAdapter,
    },
    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },
  };

  function buildFilterFields(): Record<
    FactoryPipelineFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<FactoryPipelineFilterKeys, unknown>
  ): FactoryPipelineFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
      inputTwinClassIdList: toArrayOfString(filters.inputTwinClassIdList, "id"),
      nextFactoryIdList: toArrayOfString(filters.nextFactoryIdList, "id"),
      outputTwinStatusIdList: toArrayOfString(
        filters.outputTwinStatusIdList,
        "id"
      ),
      factoryConditionSetIdList: toArrayOfString(
        filters.factoryConditionSetIdList,
        "id"
      ),
      active: mapToChoice(filters.active),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
