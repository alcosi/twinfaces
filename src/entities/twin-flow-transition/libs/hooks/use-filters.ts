import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useFactorySelectAdapter } from "@/entities/factory";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { useTwinFlowSelectAdapter } from "@/entities/twin-flow";
import { useTransitionAliasSelectAdapter } from "@/entities/twin-flow-transition";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import {
  type FilterFeature,
  isPopulatedArray,
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
  const sAdapter = useTwinStatusSelectAdapter(twinClassId);
  const pAdapter = usePermissionSelectAdapter();
  const tfAdapter = useTwinFlowSelectAdapter();
  const fAdapter = useFactorySelectAdapter();
  const tAAdapter = useTransitionAliasSelectAdapter();

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
      ...tfAdapter,
    },

    aliasLikeList: {
      type: AutoFormValueType.combobox,
      label: "Alias",
      multi: true,
      ...tAAdapter,
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
      ...sAdapter,
    },

    dstStatusIdList: {
      type: AutoFormValueType.combobox,
      label: "Destination status",
      multi: true,
      ...sAdapter,
    },

    permissionIdList: {
      type: AutoFormValueType.combobox,
      label: "Permission",
      multi: true,
      ...pAdapter,
    },

    inbuiltTwinFactoryIdList: {
      type: AutoFormValueType.combobox,
      label: "Factory",
      multi: true,
      ...fAdapter,
    },
  };

  function buildFilterFields(): Record<
    TwinFlowTransitionFilterKeys,
    AutoFormValueInfo
  > {
    if (isPopulatedArray(enabledFilters)) {
      return enabledFilters.reduce(
        (filters, key) => {
          filters[key] = allFilters[key];
          return filters;
        },
        {} as Record<TwinFlowTransitionFilterKeys, AutoFormValueInfo>
      );
    }

    return allFilters;
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
