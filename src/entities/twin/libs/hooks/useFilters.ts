import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";
import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { useUserSelectAdapter } from "@/entities/user";
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
        multi: true,
        ...tcAdapter,
      },
      statusIdList: {
        type: AutoFormValueType.combobox,
        label: "Statuses",
        multi: true,
        ...sAdapter,
      },
      twinNameLikeList: {
        type: AutoFormValueType.tag,
        label: "Name",
      },
      createdByUserIdList: {
        type: AutoFormValueType.combobox,
        label: "Author",
        multi: true,
        ...uAdapter,
      },
      assignerUserIdList: {
        type: AutoFormValueType.combobox,
        label: "Assignee",
        multi: true,
        ...uAdapter,
      },
      headTwinIdList: {
        type: AutoFormValueType.combobox,
        label: "Head",
        multi: true,
        ...tcAdapter,
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
        "userId"
      ),
      assignerUserIdList: toArrayOfString(
        toArray(filters.assignerUserIdList),
        "userId"
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
