import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory";
import {
  useTwinFlowFilters,
  useTwinFlowSelectAdapterWithFilters,
} from "@/entities/twin-flow";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArrayOfString,
} from "@/shared/libs";

import { TwinFlowFactoryFilterKeys, TwinFlowFactoryFilters } from "../../api";
import { useFactoryLauncherSelectAdapter } from "./use-select-adapter";

export function useTwinFlowFactoryFilters({
  enabledFilters,
}: {
  enabledFilters?: TwinFlowFactoryFilterKeys[];
} = {}): FilterFeature<TwinFlowFactoryFilterKeys, TwinFlowFactoryFilters> {
  const twinflowAdapter = useTwinFlowSelectAdapterWithFilters();
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const flSelectAdapter = useFactoryLauncherSelectAdapter();

  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildTwinFlowFilters,
    mapFiltersToPayload: mapTwinFlowFilters,
  } = useTwinFlowFilters({});

  const allFilters: Record<TwinFlowFactoryFilterKeys, AutoFormValueInfo> = {
    idSet: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinflowIdSet: {
      type: AutoFormValueType.complexCombobox,
      label: "Twinflow",
      adapter: twinflowAdapter,
      extraFilters: buildTwinFlowFilters(),
      mapExtraFilters: (filters) => mapTwinFlowFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    factoryIdSet: {
      type: AutoFormValueType.complexCombobox,
      label: "Factory",
      adapter: factoryAdapter,
      extraFilters: buildFactoryFilters(),
      mapExtraFilters: (filters) => mapFactoryFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    factoryLauncherSet: {
      type: AutoFormValueType.combobox,
      label: "Launcher",
      multi: true,
      ...flSelectAdapter,
    },
  };

  function buildFilterFields(): Record<
    TwinFlowFactoryFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinFlowFactoryFilterKeys, unknown>
  ): TwinFlowFactoryFilters {
    return {
      idSet: toArrayOfString(filters.idSet),
      twinflowIdSet: toArrayOfString(filters.twinflowIdSet, "id"),
      factoryIdSet: toArrayOfString(filters.factoryIdSet, "id"),
      factoryLauncherSet: toArrayOfString(filters.factoryLauncherSet, "id"),
    };
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
