import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { useTwinFlowSelectAdapter } from "@/entities/twin-flow";
import { useTransitionAliasSelectAdapter } from "@/entities/twin-flow-transition";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import {
  type FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  reduceToObject,
  toArray,
  toArrayOfString,
  wrapWithPercent,
} from "@/shared/libs";

import {
  TwinFlowTransitionFilterKeys,
  TwinFlowTransitionFilters,
} from "../../api";

export function useTwinFlowTransitionFilters({
  twinClassId,
  enabledFilters,
}: {
  twinClassId?: string;
  enabledFilters?: TwinFlowTransitionFilterKeys[];
}): FilterFeature<TwinFlowTransitionFilterKeys, TwinFlowTransitionFilters> {
  const twinStatusAdapter = useTwinStatusSelectAdapter();
  const permissionAdapter = usePermissionSelectAdapter();
  const twinFlowAdapter = useTwinFlowSelectAdapter();
  const factoryAdapter = useFactorySelectAdapter();
  const transitionAliasAdapter = useTransitionAliasSelectAdapter();

  const allFilters: Record<TwinFlowTransitionFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },

    twinflowIdList: {
      type: AutoFormValueType.combobox,
      label: "Twinflow",
      multi: true,
      ...twinFlowAdapter,
    },

    aliasLikeList: {
      type: AutoFormValueType.combobox,
      label: "Alias",
      multi: true,
      ...transitionAliasAdapter,
    },

    nameLikeList: {
      type: AutoFormValueType.tag,
      label: "Name",
    },

    descriptionLikeList: {
      type: AutoFormValueType.tag,
      label: "Description",
    },

    srcStatusIdList: {
      type: AutoFormValueType.combobox,
      label: "Source status",
      multi: true,
      ...twinStatusAdapter,
      getItems: async (search: string) =>
        twinStatusAdapter.getItems(search, {
          twinClassIdMap: reduceToObject({
            list: toArray(twinClassId),
            defaultValue: true,
          }),
        }),
    },

    dstStatusIdList: {
      type: AutoFormValueType.combobox,
      label: "Destination status",
      multi: true,
      ...twinStatusAdapter,
    },

    permissionIdList: {
      type: AutoFormValueType.combobox,
      label: "Permission",
      multi: true,
      ...permissionAdapter,
    },

    inbuiltTwinFactoryIdList: {
      type: AutoFormValueType.combobox,
      label: "Factory",
      multi: true,
      ...factoryAdapter,
    },
  };

  function buildFilterFields(): Record<
    TwinFlowTransitionFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<TwinFlowTransitionFilterKeys, unknown>
  ): TwinFlowTransitionFilters {
    const result: TwinFlowTransitionFilters = {
      idList: toArrayOfString(filters.idList),
      twinflowIdList: toArrayOfString(toArray(filters.twinflowIdList), "id"),
      aliasLikeList: toArrayOfString(
        toArray(filters.aliasLikeList),
        "alias"
      ).map(wrapWithPercent),
      nameLikeList: toArrayOfString(toArray(filters.nameLikeList), "name").map(
        wrapWithPercent
      ),
      descriptionLikeList: toArrayOfString(
        toArray(filters.descriptionLikeList),
        "description"
      ).map(wrapWithPercent),
      srcStatusIdList: toArrayOfString(toArray(filters.srcStatusIdList), "id"),
      dstStatusIdList: toArrayOfString(toArray(filters.dstStatusIdList), "id"),
      permissionIdList: toArrayOfString(
        toArray(filters.permissionIdList),
        "id"
      ),
      inbuiltTwinFactoryIdList: toArrayOfString(
        toArray(filters.inbuiltTwinFactoryIdList),
        "id"
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
