import { FilterFeature, mapToChoice, toArrayOfString } from "@/shared/libs";
import {
  FactoryPipelineFilterKeys,
  FactoryPipelineFilters,
} from "@/entities/factoryPipeline";
import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";
import { useFactorySelectAdapter } from "@/entities/factory";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { useTwinStatusSelectAdapter } from "@/entities/twinStatus";

export function useFactoryPipelineFilters(): FilterFeature<
  FactoryPipelineFilterKeys,
  FactoryPipelineFilters
> {
  const factorySelectAdapter = useFactorySelectAdapter();
  const twinClassAdapter = useTwinClassSelectAdapter();
  const twinStatusAdapter = useTwinStatusSelectAdapter();

  function buildFilterFields(): Record<
    FactoryPipelineFilterKeys,
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
        ...factorySelectAdapter,
      },
      inputTwinClassIdList: {
        type: AutoFormValueType.combobox,
        label: "Input Twin Class",
        multi: true,
        ...twinClassAdapter,
      },
      nextFactoryIdList: {
        type: AutoFormValueType.combobox,
        label: "Next Factory",
        multi: true,
        ...factorySelectAdapter,
      },
      outputTwinStatusIdList: {
        type: AutoFormValueType.combobox,
        label: "Output Twin Status",
        multi: true,
        ...twinStatusAdapter,
      },
      // TODO: Change to combobox when factoryConditionSet is implemented
      // https://alcosi.atlassian.net/browse/TWINS-241
      factoryConditionSetIdList: {
        type: AutoFormValueType.tag,
        label: "Factory Condition Set",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      active: {
        type: AutoFormValueType.boolean,
        label: "Active",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
      nextFactoryLimitScope: {
        type: AutoFormValueType.boolean,
        label: "Limit Next Factory Scope",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
      },
    };
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
        filters.factoryConditionSetIdList
      ),
      active: mapToChoice(filters.active),
      nextFactoryLimitScope: mapToChoice(filters.nextFactoryLimitScope),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
