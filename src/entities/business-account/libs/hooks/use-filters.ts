import z from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useBusinessAccountSelectAdapter } from "@/entities/business-account";
import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema";
import { useTierSelectAdapter } from "@/entities/tier";
import { useTwinClassSchemaSelectAdapter } from "@/entities/twin-class-schema";
import { useTwinFlowSchemaSelectAdapter } from "@/entities/twinFlowSchema";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArrayOfString,
} from "@/shared/libs";

import {
  DomainBusinessAccountFilterKeys,
  DomainBusinessAccountFilters,
} from "../../api/types";

export function useBusinessAccountFilters({
  enabledFilters,
}: {
  enabledFilters?: DomainBusinessAccountFilterKeys[];
} = {}): FilterFeature<
  DomainBusinessAccountFilterKeys,
  DomainBusinessAccountFilters
> {
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapter();
  const twinflowSchemaAdapter = useTwinFlowSchemaSelectAdapter();
  const twinClassSchemaAdapter = useTwinClassSchemaSelectAdapter();
  const businessAccountAdapter = useBusinessAccountSelectAdapter();
  const tierAdapter = useTierSelectAdapter();

  const allFilters: Record<DomainBusinessAccountFilterKeys, AutoFormValueInfo> =
    {
      idList: {
        type: AutoFormValueType.tag,
        label: "Id",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      businessAccountIdList: {
        type: AutoFormValueType.combobox,
        label: "Business account",
        ...businessAccountAdapter,
        multi: true,
      },
      permissionSchemaIdList: {
        type: AutoFormValueType.combobox,
        label: "Permission schema",
        ...permissionSchemaAdapter,
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
      //todo upd to select
      notificationSchemaIdList: {
        type: AutoFormValueType.tag,
        label: "Notification scheme",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      tierIdList: {
        type: AutoFormValueType.combobox,
        label: "Tier",
        ...tierAdapter,
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
    };

  function buildFilterFields(): Record<
    DomainBusinessAccountFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<DomainBusinessAccountFilterKeys, unknown>
  ): DomainBusinessAccountFilters {
    return {
      idList: toArrayOfString(filters.idList),
      businessAccountIdList: toArrayOfString(
        filters.businessAccountIdList,
        "id"
      ),
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
        filters.notificationSchemaIdList
      ),
      tierIdList: toArrayOfString(filters.tierIdList),
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
    };
  }

  return { buildFilterFields, mapFiltersToPayload };
}
