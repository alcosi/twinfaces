import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  usePermissionSchemaFilters,
  usePermissionSchemaSelectAdapterWithFilters,
} from "@/entities/permission-schema";
import { useTwinClassSchemaSelectAdapter } from "@/entities/twin-class-schema";
import { useTwinFlowSchemaSelectAdapter } from "@/entities/twinFlowSchema";
import {
  type FilterFeature,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { TierFilterKeys, TierFilters } from "../../api";

export function useTierFilters(): FilterFeature<TierFilterKeys, TierFilters> {
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapterWithFilters();
  const twinFlowSchemaAdapter = useTwinFlowSchemaSelectAdapter();
  const twinClassSchemaAdapter = useTwinClassSchemaSelectAdapter();

  const {
    buildFilterFields: buildPermissionSchemaFilters,
    mapFiltersToPayload: mapPermissionSchemaFilters,
  } = usePermissionSchemaFilters();

  function buildFilterFields(): Record<TierFilterKeys, AutoFormValueInfo> {
    return {
      idList: {
        type: AutoFormValueType.tag,
        label: "ID",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
      },
      nameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      custom: {
        type: AutoFormValueType.boolean,
        label: "Custom",
        hasIndeterminate: true,
        defaultValue: "indeterminate",
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
        multi: true,
        ...twinFlowSchemaAdapter,
      },
      twinclassSchemaIdList: {
        type: AutoFormValueType.combobox,
        label: "Class schema",
        multi: true,
        ...twinClassSchemaAdapter,
      },
      attachmentsStorageQuotaCountRange: {
        type: AutoFormValueType.numberRange,
        label: "Attachments count quota",
      },
      attachmentsStorageQuotaSizeRange: {
        type: AutoFormValueType.numberRange,
        label: "Attachments size quota",
      },
      userCountQuotaRange: {
        type: AutoFormValueType.numberRange,
        label: "User count quota",
      },
      descriptionLikeList: {
        type: AutoFormValueType.tag,
        label: "Description",
      },
    } as const;
  }

  function mapFiltersToPayload(
    filters: Record<TierFilterKeys, unknown>
  ): TierFilters {
    const result: TierFilters = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      nameLikeList: toArrayOfString(filters.nameLikeList).map(wrapWithPercent),
      custom: mapToChoice(filters.custom),
      permissionSchemaIdList: toArrayOfString(
        toArray(filters.permissionSchemaIdList),
        "id"
      ),
      twinflowSchemaIdList: toArrayOfString(
        toArray(filters.twinflowSchemaIdList),
        "id"
      ),
      twinclassSchemaIdList: toArrayOfString(
        toArray(filters.twinclassSchemaIdList),
        "id"
      ),
      attachmentsStorageQuotaCountRange: {
        from: (
          filters.attachmentsStorageQuotaCountRange as {
            from?: number;
          }
        )?.from,
        to: (
          filters.attachmentsStorageQuotaCountRange as {
            to?: number;
          }
        )?.to,
      },
      attachmentsStorageQuotaSizeRange: {
        from: (
          filters.attachmentsStorageQuotaSizeRange as {
            from?: number;
          }
        )?.from,
        to: (
          filters.attachmentsStorageQuotaSizeRange as {
            to?: number;
          }
        )?.to,
      },
      userCountQuotaRange: {
        from: (
          filters.userCountQuotaRange as {
            from?: number;
          }
        )?.from,
        to: (
          filters.userCountQuotaRange as {
            to?: number;
          }
        )?.to,
      },
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
