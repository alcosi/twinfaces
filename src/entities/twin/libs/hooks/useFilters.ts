import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import {
  TwinClass_DETAILED,
  useTwinClassSelectAdapter,
} from "@/entities/twinClass";
import { TwinStatus, useTwinStatusSelectAdapter } from "@/entities/twinStatus";
import { useUserSelectAdapter } from "@/entities/user/libs";
import {
  toArray,
  toArrayOfString,
  wrapWithPercent,
  type FilterFeature,
} from "@/shared/libs";
import { z } from "zod";
import { TwinFilterKeys, TwinFilters } from "../../api";

export function useTwinFilters(): FilterFeature<TwinFilterKeys, TwinFilters> {
  const tcAdapter = useTwinClassSelectAdapter();
  const sAdapter = useTwinStatusSelectAdapter();
  const uAdapter = useUserSelectAdapter();

  function buildFilterFields(): Record<TwinFilterKeys, AutoFormValueInfo> {
    return {
      twinIdList: {
        type: AutoFormValueType.tag,
        label: "ID",
        schema: z.string().uuid("Please enter a valid UUID"),
        placeholder: "Enter UUID",
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
        type: AutoFormValueType.tag,
        label: "Name",
      },
      createdByUserIdList: {
        type: AutoFormValueType.combobox,
        label: "Author",
        getById: uAdapter.getById,
        getItems: uAdapter.getItems,
        getItemKey: uAdapter.getItemKey,
        getItemLabel: uAdapter.getItemLabel,
        multi: true,
      },
      assignerUserIdList: {
        type: AutoFormValueType.combobox,
        label: "Assigner",
        getById: uAdapter.getById,
        getItems: uAdapter.getItems,
        getItemKey: uAdapter.getItemKey,
        getItemLabel: uAdapter.getItemLabel,
        multi: true,
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
