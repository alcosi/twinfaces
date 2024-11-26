import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { useTwinStatusSelectAdapter } from "@/entities/twinStatus";
import {
  toArray,
  toArrayOfString,
  wrapWithPercent,
  type FilterFeature,
} from "@/shared/libs";
import {
  TwinFlowTransition,
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
  const { getById, getItems, getItemKey, getItemLabel } =
    useTwinStatusSelectAdapter(twinClassId);

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
        getById,
        getItems,
        getItemKey,
        getItemLabel,
      },
      dstStatusIdList: {
        type: AutoFormValueType.combobox,
        label: "Destination status",
        multi: true,
        getById,
        getItems,
        getItemKey,
        getItemLabel,
      },
      permissionIdList: {
        type: AutoFormValueType.string,
        label: "Permission",
        // TODO: Uncomment and refactor
        // as per https://alcosi.atlassian.net/browse/TWINFACES-116
        //   type: AutoFormValueType.multiCombobox,
        //   label: "Permission",
        //   multi: true,
        //   getById: async (key: string) =>
        //     transitions?.find((i: TwinFlowTransition) => i.permissionId === key),
        //   getItems: async (needle: string) => {
        //     return transitions?.filter((i) =>
        //       i.permission?.name?.toLowerCase().includes(needle.toLowerCase())
        //     );
        //   },
        //   getItemKey: (i: TwinFlowTransition) => i.permissionId,
        //   getItemLabel: (i: TwinFlowTransition) => i.permission?.key,
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
      srcStatusIdList: toArrayOfString(
        toArray(filters.srcStatusIdList),
        "srcTwinStatusId"
      ),
      dstStatusIdList: toArrayOfString(
        toArray(filters.dstStatusIdList),
        "dstTwinStatusId"
      ),
      permissionIdList: toArrayOfString(
        toArray(filters.permissionIdList),
        "permissionId"
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
