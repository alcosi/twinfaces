import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import { useUserSelectAdapter } from "@/entities/user";
import { DataTimeRangeV1 } from "@/shared/api/types";
import {
  type FilterFeature,
  createFixedSelectAdapter,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { HISTORY_TYPES, HistoryFilterKeys, HistoryFilters } from "../../server";
import { useTwinSelectAdapter } from "./use-select-adapter";

export function useHistoryFilters({
  enabledFilters,
}: {
  enabledFilters?: HistoryFilterKeys[];
}): FilterFeature<HistoryFilterKeys, HistoryFilters> {
  const twinAdapter = useTwinSelectAdapter();
  const userAdapter = useUserSelectAdapter();
  const {
    buildFilterFields: buildTwinClassFieldFilters,
    mapFiltersToPayload: mapTwinClassFieldFilters,
  } = useTwinClassFieldFilters({});
  const twinClassFieldAdapter = useTwinClassFieldSelectAdapterWithFilters();

  const allFilters: Record<HistoryFilterKeys, AutoFormValueInfo> = {
    idList: {
      type: AutoFormValueType.tag,
      label: "ID",
    },
    twinIdList: {
      type: AutoFormValueType.combobox,
      label: "Twin",
      multi: true,
      ...twinAdapter,
    },
    twinClassFieldIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Field",
      adapter: twinClassFieldAdapter,
      extraFilters: buildTwinClassFieldFilters(),
      mapExtraFilters: (filters) => mapTwinClassFieldFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    actorUserIdList: {
      type: AutoFormValueType.combobox,
      label: "Actor User",
      multi: true,
      ...userAdapter,
    },
    typeList: {
      type: AutoFormValueType.combobox,
      label: "Type List",
      ...createFixedSelectAdapter(HISTORY_TYPES),
      multi: true,
    },
    createdAtFrom: {
      type: AutoFormValueType.string,
      label: "Created from",
      input_props: { type: "date" },
    },
    createdAtTo: {
      type: AutoFormValueType.string,
      label: "Created to",
      input_props: { type: "date" },
    },
  };

  function buildFilterFields(): Record<HistoryFilterKeys, AutoFormValueInfo> {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<string, unknown>
  ): HistoryFilters {
    const result: HistoryFilters & {
      createdAt: DataTimeRangeV1;
    } = {
      idList: toArrayOfString(toArray(filters.idList), "id"),
      twinIdList: toArrayOfString(toArray(filters.twinIdList), "id"),

      twinClassFieldIdList: toArrayOfString(
        toArray(filters.twinClassFieldIdList),
        "id"
      ),
      actorUserIdList: toArrayOfString(
        toArray(filters.actorUserIdList),
        "userId"
      ),
      typeList: toArray(filters.typeList as HistoryFilters["typeList"]),
      createdAt: {
        from: filters.createdAtFrom ? `${filters.createdAtFrom}T00:00:00` : "",
        to: filters.createdAtTo ? `${filters.createdAtTo}T00:00:00` : "",
      },
    };
    return result;
  }

  return { buildFilterFields, mapFiltersToPayload };
}
