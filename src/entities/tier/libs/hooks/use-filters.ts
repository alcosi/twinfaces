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
  const pSAdapter = usePermissionSchemaSelectAdapter();
  const tFAdapter = useTwinFlowSchemaSelectAdapter();

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
        ...pSAdapter,
      },
      twinflowSchemaIdList: {
        type: AutoFormValueType.combobox,
        label: "Twinflow schema",
        multi: true,
        ...tFAdapter,
      },
      //TODO need to complete the filtering logic https://alcosi.atlassian.net/browse/TWINFACES-408
      attachmentsStorageQuotaCountRange: {
        type: AutoFormValueType.number,
        label: "Attachments count quota, from",
      },
      //TODO need to complete the filtering logic https://alcosi.atlassian.net/browse/TWINFACES-408
      attachmentsStorageQuotaSizeRange: {
        type: AutoFormValueType.number,
        label: "Attachments size quota, from",
      },
      //TODO need to complete the filtering logic https://alcosi.atlassian.net/browse/TWINFACES-408
      userCountQuotaRange: {
        type: AutoFormValueType.number,
        label: "User count quota, from",
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
        from: Number(filters.attachmentsStorageQuotaCountRange),
      },
      attachmentsStorageQuotaSizeRange: {
        from: Number(filters.attachmentsStorageQuotaSizeRange),
      },
      userCountQuotaRange: {
        from: Number(filters.userCountQuotaRange),
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
