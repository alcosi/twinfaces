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
  FactoryPipelineFilterKeys,
  FactoryPipelineFilters,
} from "@/entities/factory-pipeline";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import {
  useStatusFilters,
  useTwinStatusSelectAdapterWithFilters,
} from "@/entities/twin-status";
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
  const factorySelectAdapter = useFactorySelectAdapterWithFilters();
  const nextFactorySelectAdapter = useFactorySelectAdapterWithFilters();
  const twinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const twinStatusAdapter = useTwinStatusSelectAdapterWithFilters();
  const factoryConditionSetAdapter =
    useFactoryConditionSetSelectAdapterWithFilters();

  const {
    buildFilterFields: buildStatusFilters,
    mapFiltersToPayload: mapStatusFilters,
  } = useStatusFilters({ enabledFilters: undefined });

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();
  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildFactoryConditionSetFilters,
    mapFiltersToPayload: mapFactoryConditionSetFilters,
  } = useFactoryConditionSetFilters();

  const allFilters: Record<FactoryPipelineFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    factoryIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Factory",
      adapter: factorySelectAdapter,
      extraFilters: buildFactoryFilters(),
      mapExtraFilters: (filters) => mapFactoryFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    inputTwinClassIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Input Twin Class",
      adapter: twinClassAdapter,
      extraFilters: buildTwinClassFilters(),
      mapExtraFilters: (filters) => mapTwinClassFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    factoryConditionSetIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Factory Condition Set",
      adapter: factoryConditionSetAdapter,
      extraFilters: buildFactoryConditionSetFilters(),
      mapExtraFilters: (filters) => mapFactoryConditionSetFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    active: {
      type: AutoFormValueType.boolean,
      label: "Active",
      hasIndeterminate: true,
      defaultValue: "indeterminate",
    },
    outputTwinStatusIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Output Twin Status",
      adapter: twinStatusAdapter,
      extraFilters: buildStatusFilters(),
      mapExtraFilters: (filters) => mapStatusFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    nextFactoryIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Next Factory",
      adapter: nextFactorySelectAdapter,
      extraFilters: buildFactoryFilters(),
      mapExtraFilters: (filters) => mapFactoryFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
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
