import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useBusinessAccountSelectAdapter } from "@/entities/business-account";
import {
  TRIGGER_TASK_STATUS_TYPES,
  TriggerTaskFilterKeys,
  TriggerTaskFilters,
} from "@/entities/trigger-task";
import { useTwinSelectAdapter } from "@/entities/twin";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { useTwinTriggerSelectAdapter } from "@/entities/twin-trigger";
import { useUserSelectAdapter } from "@/entities/user";
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
  const twinAdapter = useTwinSelectAdapter();
  const twinTriggerAdapter = useTwinTriggerSelectAdapter();
  const userAdapter = useUserSelectAdapter();
  const businessAccountAdapter = useBusinessAccountSelectAdapter();
  const twinStatusAdapter = useTwinStatusSelectAdapter();

  const allFilters: Record<TriggerTaskFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
      schema: z.string().uuid("Please enter a valid UUID"),
    },
    twinIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin",
      multi: true,
      ...twinAdapter,
    },
    twinTriggerIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin trigger",
      multi: true,
      ...twinTriggerAdapter,
    },
    previousTwinStatusIdList: {
      type: AutoFormValueType.combobox,
      label: "Previous twin status",
      multi: true,
      ...twinStatusAdapter,
    },
    createdByUserIdList: {
      type: AutoFormValueType.combobox,
      label: "Created by user",
      multi: true,
      ...userAdapter,
    },
    businessAccountIdList: {
      type: AutoFormValueType.combobox,
      label: "Business account",
      ...businessAccountAdapter,
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
