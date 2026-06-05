import { z } from "zod";

import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useFactoryFilters,
  useFactorySelectAdapterWithFilters,
} from "@/entities/factory";
import {
  usePermissionFilters,
  usePermissionSelectAdapterWithFilters,
} from "@/entities/permission";
import {
  useTwinFlowFilters,
  useTwinFlowSelectAdapterWithFilters,
} from "@/entities/twin-flow";
import {
  TransitionType,
  useTransitionAliasSelectAdapter,
  useTransitionSelectTypeAdapter,
} from "@/entities/twin-flow-transition";
import {
  useStatusFilters,
  useTwinStatusSelectAdapter,
  useTwinStatusSelectAdapterWithFilters,
} from "@/entities/twin-status";
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
  const dstStatusAdapter = useTwinStatusSelectAdapterWithFilters();
  const permissionAdapter = usePermissionSelectAdapterWithFilters();
  const twinFlowAdapter = useTwinFlowSelectAdapterWithFilters();
  const factoryAdapter = useFactorySelectAdapterWithFilters();
  const transitionAliasAdapter = useTransitionAliasSelectAdapter();
  const typeSelectAdapter = useTransitionSelectTypeAdapter();

  const {
    buildFilterFields: buildTwinFlowFilters,
    mapFiltersToPayload: mapTwinFlowFilters,
  } = useTwinFlowFilters({});
  const {
    buildFilterFields: buildFactoryFilters,
    mapFiltersToPayload: mapFactoryFilters,
  } = useFactoryFilters();
  const {
    buildFilterFields: buildStatusFilters,
    mapFiltersToPayload: mapStatusFilters,
  } = useStatusFilters({ enabledFilters: undefined });
  const {
    buildFilterFields: buildPermissionFilters,
    mapFiltersToPayload: mapPermissionFilters,
  } = usePermissionFilters();

  const allFilters: Record<TwinFlowTransitionFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "Id",
      schema: z.string().uuid("Please enter a valid UUID"),
      placeholder: "Enter UUID",
    },

    twinflowIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Twinflow",
      adapter: twinFlowAdapter,
      extraFilters: buildTwinFlowFilters(),
      mapExtraFilters: (filters) => mapTwinFlowFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
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

    twinflowTransitionTypeList: {
      type: AutoFormValueType.combobox,
      label: "Type",
      multi: true,
      ...typeSelectAdapter,
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
      type: AutoFormValueType.complexCombobox,
      label: "Destination status",
      adapter: dstStatusAdapter,
      extraFilters: buildStatusFilters(),
      mapExtraFilters: (filters) => mapStatusFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },

    permissionIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Permission",
      adapter: permissionAdapter,
      extraFilters: buildPermissionFilters(),
      mapExtraFilters: (filters) => mapPermissionFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },

    inbuiltTwinFactoryIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Factory",
      adapter: factoryAdapter,
      extraFilters: buildFactoryFilters(),
      mapExtraFilters: (filters) => mapFactoryFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
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
      twinflowTransitionTypeList: toArrayOfString(
        filters.twinflowTransitionTypeList,
        "id"
      ) as TransitionType[],
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
