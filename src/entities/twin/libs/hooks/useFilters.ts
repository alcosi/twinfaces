import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twinClass";
import {
  toArray,
  toArrayOfString,
  wrapWithPercent,
  type FilterFeature,
} from "@/shared/libs";
import { TwinFilterKeys, TwinFilters } from "../../api";
import { TwinStatus, useTwinStatusSelectAdapter } from "@/entities/twinStatus";

export function useTwinFilters(): FilterFeature<TwinFilterKeys, TwinFilters> {
  const tcAdapter = useTwinClassSelectAdapter();
  const sAdapter = useTwinStatusSelectAdapter();

  function buildFilterFields(): Record<TwinFilterKeys, AutoFormValueInfo> {
    return {
      twinIdList: {
        type: AutoFormValueType.uuid,
        label: "ID",
      },
      twinClassIdList: {
        type: AutoFormValueType.combobox,
        label: "Twin Class",
        getById: tcAdapter.getById,
        getItems: tcAdapter.getItems,
        getItemKey: (i) => tcAdapter.getItemKey(i as TwinClass_DETAILED),
        getItemLabel: (i) => tcAdapter.getItemLabel(i as TwinClass_DETAILED),
        multi: true,
      },
      statusIdList: {
        type: AutoFormValueType.combobox,
        label: "Statuses",
        getById: sAdapter.getById,
        getItems: sAdapter.getItems,
        getItemKey: (i) => sAdapter.getItemKey(i as TwinStatus),
        getItemLabel: (i) => sAdapter.getItemLabel(i as TwinStatus),
        multi: true,
      },
      twinNameLikeList: {
        // TODO: replace with combobox
        // via using useTwinSelectAdapter
        type: AutoFormValueType.string,
        label: "Name",
      },
      createdByUserIdList: {
        type: AutoFormValueType.string,
        label: "Author ID",
      },
      assignerUserIdList: {
        type: AutoFormValueType.string,
        label: "Assigner ID",
      },
      headTwinIdList: {
        type: AutoFormValueType.combobox,
        label: "Head",
        getById: tcAdapter.getById,
        getItems: tcAdapter.getItems,
        getItemKey: (item: unknown) =>
          tcAdapter.getItemKey(item as TwinClass_DETAILED),
        getItemLabel: (item: unknown) =>
          tcAdapter.getItemLabel(item as TwinClass_DETAILED),
        multi: true,
      },
      tagDataListOptionIdList: {
        type: AutoFormValueType.string,
        label: "Tags",
      },
      markerDataListOptionIdList: {
        type: AutoFormValueType.string,
        label: "Markers",
      },
    } as const;
  }

  function mapFiltersToPayload(
    filters: Record<TwinFilterKeys, unknown>
  ): TwinFilters {
    const result: TwinFilters = {
      twinIdList: toArrayOfString(toArray(filters.twinIdList), "id"),
      twinNameLikeList: toArrayOfString(
        toArray(filters.twinNameLikeList),
        "name"
      ).map(wrapWithPercent),
      twinClassIdList: toArrayOfString(toArray(filters.twinClassIdList), "id"),
      statusIdList: toArrayOfString(toArray(filters.statusIdList), "id"),
      createdByUserIdList: toArrayOfString(
        toArray(filters.createdByUserIdList),
        "id"
      ),
      assignerUserIdList: toArrayOfString(
        toArray(filters.assignerUserIdList),
        "id"
      ),
      headTwinIdList: toArrayOfString(toArray(filters.headTwinIdList), "id"),
      tagDataListOptionIdList: toArrayOfString(
        toArray(filters.tagDataListOptionIdList)
      ),
      markerDataListOptionIdList: toArrayOfString(
        toArray(filters.markerDataListOptionIdList)
      ),
    };

    return result;
  }

  return {
    buildFilterFields,
    mapFiltersToPayload,
  };
}
