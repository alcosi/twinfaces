import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { usePermissionSchemaSelectAdapter } from "@/entities/permission-schema";
import { useTwinFlowSchemaSelectAdapter } from "@/entities/twinFlowSchema";
import {
  type FilterFeature,
  mapToChoice,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import { TierFilterKeys, TierFilters } from "../../api";

//TODO added filter Class schema https://alcosi.atlassian.net/browse/TWINFACES-406 now this task is block
export function useTierFilters(): FilterFeature<TierFilterKeys, TierFilters> {
  const permissionSchemaAdapter = usePermissionSchemaSelectAdapter();
  const twinFlowSchemaAdapter = useTwinFlowSchemaSelectAdapter();

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
        type: AutoFormValueType.combobox,
        label: "Permission schema",
        multi: true,
        ...permissionSchemaAdapter,
      },
      twinflowSchemaIdList: {
        type: AutoFormValueType.combobox,
        label: "Twinflow schema",
        multi: true,
        ...twinFlowSchemaAdapter,
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
      attachmentsStorageQuotaCountRange: {
        from: Number(
          (
            filters.attachmentsStorageQuotaCountRange as {
              from?: number;
            }
          )?.from
        ),
        to: Number(
          (
            filters.attachmentsStorageQuotaCountRange as {
              to?: number;
            }
          )?.to
        ),
      },
      attachmentsStorageQuotaSizeRange: {
        from: Number(
          (
            filters.attachmentsStorageQuotaSizeRange as {
              from?: number;
            }
          )?.from
        ),
        to: Number(
          (
            filters.attachmentsStorageQuotaSizeRange as {
              to?: number;
            }
          )?.to
        ),
      },
      userCountQuotaRange: {
        from: Number(
          (
            filters.userCountQuotaRange as {
              from?: number;
            }
          )?.from
        ),
        to: Number(
          (
            filters.userCountQuotaRange as {
              to?: number;
            }
          )?.to
        ),
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
