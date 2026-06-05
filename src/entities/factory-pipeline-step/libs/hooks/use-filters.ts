import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory";
import {
  useFactoryConditionSetFilters,
  useFactoryConditionSetSelectAdapterWithFilters,
} from "@/entities/factory-condition-set";
import {
  useFactoryPipelineFilters,
  useFactoryPipelineSelectAdapterWithFilters,
} from "@/entities/factory-pipeline";
import { useFeaturerSelectAdapter } from "@/entities/featurer";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { PipelineStepFilterKeys, PipelineStepFilters } from "../../api";

export function usePipelineStepFilters({
  enabledFilters,
}: {
  enabledFilters?: PipelineStepFilterKeys[];
}): FilterFeature<PipelineStepFilterKeys, PipelineStepFilters> {
  const fAdapter = useFactorySelectAdapterWithFilters();
  const fpAdapter = useFactoryPipelineSelectAdapterWithFilters();
  const featurerAdapter = useFeaturerSelectAdapter(23);
  const fcsAdapter = useFactoryConditionSetSelectAdapterWithFilters();

  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildFactoryPipelineFilters,
    mapFiltersToPayload: mapFactoryPipelineFilters,
  } = useFactoryPipelineFilters({});
  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();

  const allFilters: Record<PipelineStepFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    factoryIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Factory",
      adapter: fAdapter,
      extraFilters: buildFactoryFilters(),
      mapExtraFilters: (filters) => mapFactoryFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    factoryPipelineIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Pipeline",
      adapter: fpAdapter,
      extraFilters: buildFactoryPipelineFilters(),
      mapExtraFilters: (filters) => mapFactoryPipelineFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    factoryConditionSetIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Condition set",
      adapter: fcsAdapter,
      extraFilters: buildFactoryConditionSetFilters(),
      mapExtraFilters: (filters) => mapFactoryConditionSetFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
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
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
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
