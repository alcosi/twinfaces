import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { useTwinStatusSelectAdapter } from "@/entities/twinStatus";
import {
  toArray,
  toArrayOfString,
  wrapWithPercent,
  type FilterFeature,
} from "@/shared/libs";
import {
  TwinFlowTransition_DETAILED,
  TwinFlowTransitionFilterKeys,
  TwinFlowTransitionFilters,
  useFetchTwinFlowTransitionById,
  useTwinFlowTransitionSearchV1,
} from "../../api";

type FilterKeys = Exclude<TwinFlowTransitionFilterKeys, "twinflowIdList">;

export function useTwinFlowTransitionFilters(
  twinClassId?: string
): FilterFeature<FilterKeys, TwinFlowTransitionFilters> {
  const { fetchTwinFlowTransitionById } = useFetchTwinFlowTransitionById();
  const { searchTwinFlowTransitions } = useTwinFlowTransitionSearchV1();
  const tcAdapter = useTwinStatusSelectAdapter(twinClassId);
  const pAdapter = usePermissionSelectAdapter();

  function buildFilterFields(): Record<FilterKeys, AutoFormValueInfo> {
    return {
      aliasLikeList: {
        type: AutoFormValueType.combobox,
        label: "Alias",
        multi: true,
        getById: fetchTwinFlowTransitionById,
        getItems: async (search: string) => {
          const { data } = await searchTwinFlowTransitions({ search });
          return data;
        },
        getItemKey: (i: TwinFlowTransition_DETAILED) => i.alias,
        getItemLabel: (i: TwinFlowTransition_DETAILED) => i.alias,
      },
      srcStatusIdList: {
        type: AutoFormValueType.combobox,
        label: "Source status",
        multi: true,
        getById: tcAdapter.getById,
        getItems: tcAdapter.getItems,
        getItemKey: tcAdapter.getItemKey,
        getItemLabel: tcAdapter.getItemLabel,
      },
      dstStatusIdList: {
        type: AutoFormValueType.combobox,
        label: "Destination status",
        multi: true,
        getById: tcAdapter.getById,
        getItems: tcAdapter.getItems,
        getItemKey: tcAdapter.getItemKey,
        getItemLabel: tcAdapter.getItemLabel,
      },
      permissionIdList: {
        type: AutoFormValueType.combobox,
        label: "Permission",
        multi: true,
        getById: pAdapter.getById,
        getItems: pAdapter.getItems,
        getItemKey: pAdapter.getItemKey,
        getItemLabel: pAdapter.getItemLabel,
      },
    };
  }

  function mapFiltersToPayload(
    filters: Record<FilterKeys, unknown>
  ): TwinFlowTransitionFilters {
    const result: TwinFlowTransitionFilters = {
      aliasLikeList: toArrayOfString(
        toArray(filters.aliasLikeList),
        "alias"
      ).map(wrapWithPercent),
      srcStatusIdList: toArrayOfString(toArray(filters.srcStatusIdList), "id"),
      dstStatusIdList: toArrayOfString(toArray(filters.dstStatusIdList), "id"),
      permissionIdList: toArrayOfString(
        toArray(filters.permissionIdList),
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
