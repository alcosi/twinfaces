import {
  FilterFeature,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";
import { PipelineStepFilterKeys, PipelineStepFilters } from "../../api";
import { useFactorySelectAdapter } from "@/entities/factory";
import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { z } from "zod";
import { useFactoryPipelineSelectAdapter } from "@/entities/factory-pipeline";
import { useFeaturerSelectAdapter } from "../../../featurer";

export function usePipelineStepFilters(): FilterFeature<
  PipelineStepFilterKeys,
  PipelineStepFilters
> {
  const factorySelectAdapter = useFactorySelectAdapter();
  const factoryPipelineSelectAdapter = useFactoryPipelineSelectAdapter();
  const featurerSelectAdapter = useFeaturerSelectAdapter(13);

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
