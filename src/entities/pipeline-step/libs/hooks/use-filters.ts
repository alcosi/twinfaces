import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { useFactorySelectAdapter } from "@/entities/factory";
import { useFactoryConditionSetSelectAdapter } from "@/entities/factory-condition-set";
import { useFactoryPipelineSelectAdapter } from "@/entities/factory-pipeline";
import { useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  FilterFeature,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { z } from "zod";
import { PipelineStepFilterKeys, PipelineStepFilters } from "../../api";

export function usePipelineStepFilters(): FilterFeature<
  PipelineStepFilterKeys,
  PipelineStepFilters
> {
  const factorySelectAdapter = useFactorySelectAdapter();
  const factoryPipelineSelectAdapter = useFactoryPipelineSelectAdapter();
  const featurerSelectAdapter = useFeaturerSelectAdapter(23);
  const factoryConditionSetSelectAdapter =
    useFactoryConditionSetSelectAdapter();

  function buildFilterFields(): Record<
    PipelineStepFilterKeys,
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
      factoryPipelineIdList: {
        type: AutoFormValueType.combobox,
        label: "Pipeline",
        multi: true,
        ...factoryPipelineSelectAdapter,
      },
      factoryConditionSetIdList: {
        type: AutoFormValueType.combobox,
        label: "Condition set",
        multi: true,
        ...factoryConditionSetSelectAdapter,
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
        ...featurerSelectAdapter,
      },
      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
    };
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
