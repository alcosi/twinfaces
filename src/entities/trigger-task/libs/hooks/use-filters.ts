import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useBusinessAccountFilters,
  useBusinessAccountSelectAdapterWithFilters,
} from "@/entities/business-account";
import {
  TRIGGER_TASK_STATUS_TYPES,
  TriggerTaskFilterKeys,
  TriggerTaskFilters,
} from "@/entities/trigger-task";
import {
  useTwinFilters,
  useTwinSelectAdapterWithFilters,
} from "@/entities/twin";
import {
  useStatusFilters,
  useTwinStatusSelectAdapterWithFilters,
} from "@/entities/twin-status";
import {
  useTwinTriggerFilters,
  useTwinTriggerSelectAdapterWithFilters,
} from "@/entities/twin-trigger";
import {
  useUserFilters,
  useUserSelectAdapterWithFilters,
} from "@/entities/user";
import {
  FilterFeature,
  createFixedSelectAdapter,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

export function useTriggerTaskFilters({
  enabledFilters,
}: {
  enabledFilters?: TriggerTaskFilterKeys[];
}): FilterFeature<TriggerTaskFilterKeys, TriggerTaskFilters> {
  const twinAdapter = useTwinSelectAdapterWithFilters();
  const twinTriggerAdapter = useTwinTriggerSelectAdapterWithFilters();
  const userAdapter = useUserSelectAdapterWithFilters();
  const businessAccountAdapter = useBusinessAccountSelectAdapterWithFilters();
  const twinStatusAdapter = useTwinStatusSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinFilters,
    mapFiltersToPayload: mapTwinFilters,
  } = useTwinFilters({});
  const {
    buildFilterFields: buildUserFilters,
    mapFiltersToPayload: mapUserFilters,
  } = useUserFilters();
  const {
    buildFilterFields: buildBusinessAccountFilters,
    mapFiltersToPayload: mapBusinessAccountFilters,
  } = useBusinessAccountFilters();
  const {
    buildFilterFields: buildTwinTriggerFilters,
    mapFiltersToPayload: mapTwinTriggerFilters,
  } = useTwinTriggerFilters({});
  const {
    buildFilterFields: buildStatusFilters,
    mapFiltersToPayload: mapStatusFilters,
  } = useStatusFilters({ enabledFilters: undefined });

  const allFilters: Record<TriggerTaskFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
    },
    twinIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin",
      adapter: twinAdapter,
      extraFilters: buildTwinFilters(),
      mapExtraFilters: (filters) => mapTwinFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    twinTriggerIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Twin trigger",
      adapter: twinTriggerAdapter,
      extraFilters: buildTwinTriggerFilters(),
      mapExtraFilters: (filters) => mapTwinTriggerFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    previousTwinStatusIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Previous twin status",
      adapter: twinStatusAdapter,
      extraFilters: buildStatusFilters(),
      mapExtraFilters: (filters) => mapStatusFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    createdByUserIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Created by user",
      adapter: userAdapter,
      extraFilters: buildUserFilters(),
      mapExtraFilters: (filters) => mapUserFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    businessAccountIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Business account",
      adapter: businessAccountAdapter,
      extraFilters: buildBusinessAccountFilters(),
      mapExtraFilters: (filters) => mapBusinessAccountFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    statusIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin trigger task status",
      ...createFixedSelectAdapter(TRIGGER_TASK_STATUS_TYPES),
    },
  };

  function buildFilterFields(): Record<
    TriggerTaskFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TriggerTaskFilterKeys, unknown>
  ): TriggerTaskFilters {
    const result: TriggerTaskFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      twinIdList: toArrayOfString(toArray(filters.twinIdList), "id"),
      twinTriggerIdList: toArrayOfString(
        toArray(filters.twinTriggerIdList),
        "id"
      ).map(String),
      previousTwinStatusIdList: toArrayOfString(
        filters.previousTwinStatusIdList,
        "id"
      ),
      createdByUserIdList: toArrayOfString(
        filters.createdByUserIdList,
        "userId"
      ),
      businessAccountIdList: toArrayOfString(
        filters.businessAccountIdList,
        "id"
      ),
      statusIdList: toArray(
        filters.statusIdList as TriggerTaskFilters["statusIdList"]
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
