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
  const sAdapter = useTwinStatusSelectAdapter(twinClassId);
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
        renderItem: (i: TwinFlowTransition_DETAILED) => i.alias,
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
