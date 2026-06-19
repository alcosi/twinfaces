import z from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useBusinessAccountSelectAdapterWithFilters } from "@/entities/business-account";
import { useNotificationSchemaSelectAdapter } from "@/entities/notification";
import {
  usePermissionSchemaFilters,
  usePermissionSchemaSelectAdapterWithFilters,
} from "@/entities/permission-schema";
import {
  useTierFilters,
  useTierSelectAdapterWithFilters,
} from "@/entities/tier";
import { useTwinClassSchemaSelectAdapter } from "@/entities/twin-class-schema";
import { useTwinFlowSchemaSelectAdapter } from "@/entities/twinFlowSchema";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArrayOfString,
} from "@/shared/libs";

import {
  DomainBusinessAccountFilterFormKeys,
  DomainBusinessAccountFilterKeys,
  DomainBusinessAccountFilters,
} from "../../api/types";

export function useBusinessAccountFilters({
  enabledFilters,
}: {
  enabledFilters?: DomainBusinessAccountFilterKeys[];
} = {}): FilterFeature<
  DomainBusinessAccountFilterFormKeys,
  DomainBusinessAccountFilters
> {
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapterWithFilters();
  const twinflowSchemaAdapter = useTwinFlowSchemaSelectAdapter();
  const twinClassSchemaAdapter = useTwinClassSchemaSelectAdapter();
  const businessAccountAdapter = useBusinessAccountSelectAdapterWithFilters();
  const tierAdapter = useTierSelectAdapterWithFilters();
  const notificationSchemaAdapter = useNotificationSchemaSelectAdapter();

  const {
    buildFilterFields: buildPermissionSchemaFilters,
    mapFiltersToPayload: mapPermissionSchemaFilters,
  } = usePermissionSchemaFilters();
  const {
    buildFilterFields: buildTierFilters,
    mapFiltersToPayload: mapTierFilters,
  } = useTierFilters();

  function expandEnabledFilters(
    enabledFilters?: DomainBusinessAccountFilterKeys[]
  ): DomainBusinessAccountFilterFormKeys[] | undefined {
    return enabledFilters?.flatMap((filterKey) => {
      if (filterKey === "businessAccountIdList") {
        return ["businessAccountIdTagList", "businessAccountIdComboboxList"];
      }

      return [filterKey as DomainBusinessAccountFilterFormKeys];
    });
  }

  const allFilters: Record<
    DomainBusinessAccountFilterFormKeys,
    AutoFormValueInfo
  > = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },
    // businessAccountIdList: {
    //   type: AutoFormValueType.tag,
    //   label: "Business account ID",
    //   schema: z.string().uuid("Please enter a valid UUID"),
    //   placeholder: "Enter UUID",
    // },
    // businessAccountIdList: {
    //   type: AutoFormValueType.complexCombobox,
    //   label: "Business account",
    //   adapter: businessAccountAdapter,
    //   // NOTE: extraFilters intentionally empty — using useBusinessAccountFilters
    //   // here would recurse (this is the Business Account filters hook itself).
    //   extraFilters: {},
    //   searchPlaceholder: "Search...",
    //   selectPlaceholder: "Select...",
    //   multi: true,
    // },
    businessAccountIdTagList: {
      type: AutoFormValueType.tag,
      label: "Business account ID",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },

    businessAccountIdComboboxList: {
      type: AutoFormValueType.complexCombobox,
      label: "Business account",
      adapter: businessAccountAdapter,
      extraFilters: {},
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    permissionSchemaIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Permission schema",
      adapter: permissionSchemaAdapter,
      extraFilters: buildPermissionSchemaFilters(),
      mapExtraFilters: (filters) => mapPermissionSchemaFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    twinflowSchemaIdList: {
      type: AutoFormValueType.combobox,
      label: "Twinflow schema",
      ...twinflowSchemaAdapter,
      multi: true,
    },
    twinClassSchemaIdList: {
      type: AutoFormValueType.combobox,
      label: "Class schema",
      ...twinClassSchemaAdapter,
      multi: true,
    },
    notificationSchemaIdList: {
      type: AutoFormValueType.combobox,
      label: "Notification schema",
      multi: true,
      ...notificationSchemaAdapter,
    },
    tierIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Tier",
      adapter: tierAdapter,
      extraFilters: buildTierFilters(),
      mapExtraFilters: (filters) => mapTierFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    storageUsedCountRange: {
      type: AutoFormValueType.numberRange,
      label: "Attachments storage used count",
    },
    storageUsedSizeRange: {
      type: AutoFormValueType.numberRange,
      label: "Attachments storage used size",
    },
    createdAt: {
      type: AutoFormValueType.dateRange,
      label: "Created",
    },
  };

  function buildFilterFields(): Record<
    DomainBusinessAccountFilterFormKeys,
    AutoFormValueInfo
  > {
    const expandedEnabledFilters = expandEnabledFilters(enabledFilters);

    return isPopulatedArray(expandedEnabledFilters)
      ? extractEnabledFilters(expandedEnabledFilters, allFilters)
      : allFilters;
  }

  function uniqueStrings(values: string[]) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function mapFiltersToPayload(
    filters: Record<DomainBusinessAccountFilterFormKeys, unknown>
  ): DomainBusinessAccountFilters {
    const createdAt = filters.createdAt as { from?: string; to?: string };

    const businessAccountIdListFromTag = toArrayOfString(
      filters.businessAccountIdTagList
    );

    const businessAccountIdListFromCombobox = toArrayOfString(
      filters.businessAccountIdComboboxList,
      "id"
    );
    const result: DomainBusinessAccountFilters = {
      idList: toArrayOfString(filters.idList),
      businessAccountIdList: uniqueStrings([
        ...businessAccountIdListFromTag,
        ...businessAccountIdListFromCombobox,
      ]),
      permissionSchemaIdList: toArrayOfString(
        filters.permissionSchemaIdList,
        "id"
      ),
      twinflowSchemaIdList: toArrayOfString(filters.twinflowSchemaIdList, "id"),
      twinClassSchemaIdList: toArrayOfString(
        filters.twinClassSchemaIdList,
        "id"
      ),
      notificationSchemaIdList: toArrayOfString(
        filters.notificationSchemaIdList,
        "id"
      ),
      tierIdList: toArrayOfString(filters.tierIdList, "id"),
      storageUsedCountRange: {
        from: (
          filters.storageUsedCountRange as {
            from?: number;
          }
        )?.from,
        to: (
          filters.storageUsedCountRange as {
            to?: number;
          }
        )?.to,
      },
      storageUsedSizeRange: {
        from: (
          filters.storageUsedSizeRange as {
            from?: number;
          }
        )?.from,
        to: (
          filters.storageUsedSizeRange as {
            to?: number;
          }
        )?.to,
      },
      createdAt: {
        from: createdAt?.from ? `${createdAt.from}T00:00:00` : "",
        to: createdAt?.to ? `${createdAt.to}T00:00:00` : "",
      },
    };

    return result;
  }

  return { buildFilterFields, mapFiltersToPayload };
}
