import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { useFactorySelectAdapter } from "@/entities/factory";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { useFactoryPipelineSelectAdapter } from "@/entities/factory-pipeline";
import { useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  FilterFeature,
  isPopulatedArray,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { z } from "zod";
import { PipelineStepFilterKeys, PipelineStepFilters } from "../../api";

export function usePipelineStepFilters({
  enabledFilters,
}: {
  enabledFilters?: PipelineStepFilterKeys[];
}): FilterFeature<PipelineStepFilterKeys, PipelineStepFilters> {
  const fAdapter = useFactorySelectAdapter();
  const fpAdapter = useFactoryPipelineSelectAdapter();
  const featurerAdapter = useFeaturerSelectAdapter(23);
  const fcsAdapter = useFactoryConditionSetSelectAdapter();

  const allFilters: Record<PipelineStepFilterKeys, AutoFormValueInfo> = {
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
      ...fAdapter,
    },
    factoryPipelineIdList: {
      type: AutoFormValueType.combobox,
      label: "Pipeline",
      multi: true,
      ...fpAdapter,
    },
    factoryConditionSetIdList: {
      type: AutoFormValueType.combobox,
      label: "Condition set",
      multi: true,
      ...fcsAdapter,
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
    optional: {
      type: AutoFormValueType.boolean,
      label: "Optional",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    fillerFeaturerIdList: {
      type: AutoFormValueType.combobox,
      label: "Filler featurer",
      multi: true,
      ...featurerAdapter,
    },
    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },
  };

  function buildFilterFields(): Record<
    PipelineStepFilterKeys,
    AutoFormValueInfo
  > {
    if (isPopulatedArray(enabledFilters)) {
      return enabledFilters.reduce(
        (filters, key) => {
          filters[key] = allFilters[key];
          return filters;
        },
        {} as Record<PipelineStepFilterKeys, AutoFormValueInfo>
      );
    }

    return allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<PipelineStepFilterKeys, unknown>
  ): PipelineStepFilters {
    return {
      idList: toArrayOfString(filters.idList),
      factoryIdList: toArrayOfString(filters.factoryIdList, "id"),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
      optional: mapToChoice(filters.optional),
      factoryPipelineIdList: toArrayOfString(
        filters.factoryPipelineIdList,
        "id"
      ),
      factoryConditionSetIdList: toArrayOfString(
        filters.factoryConditionSetIdList,
        "id"
      ),
      conditionInvert: mapToChoice(filters.conditionInvert),
      active: mapToChoice(filters.active),
      fillerFeaturerIdList: toArrayOfString(
        toArray(filters.fillerFeaturerIdList),
        "id"
      ).map(Number),
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
