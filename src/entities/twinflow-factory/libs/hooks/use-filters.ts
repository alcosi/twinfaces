import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { useTwinFlowSelectAdapter } from "@/entities/twin-flow";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArrayOfString,
} from "@/shared/libs";

import { TwinFlowFactoryFilterKeys, TwinFlowFactoryFilters } from "../../api";

export function useTwinFlowFactoryFilters({
  enabledFilters,
}: {
  enabledFilters?: TwinFlowFactoryFilterKeys[];
} = {}): FilterFeature<TwinFlowFactoryFilterKeys, TwinFlowFactoryFilters> {
  const twinflowAdapter = useTwinFlowSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();

  const allFilters: Record<TwinFlowFactoryFilterKeys, AutoFormValueInfo> = {
    idSet: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    twinflowIdSet: {
      type: AutoFormValueType.combobox,
      label: "Twinflow",
      multi: true,
      ...twinflowAdapter,
    },
    factoryIdSet: {
      type: AutoFormValueType.combobox,
      label: "Factory",
      multi: true,
      ...factoryAdapter,
    },
    factoryLauncherSet: {
      type: AutoFormValueType.tag,
      label: "Launcher",
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
      factoryLauncherSet: toArrayOfString(filters.factoryLauncherSet),
    };
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
