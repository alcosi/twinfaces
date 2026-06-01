import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useTwinSelectAdapter } from "@/entities/twin";
import {
  useTwinClassFieldFilters,
  useTwinClassFieldSelectAdapterWithFilters,
} from "@/entities/twin-class-field";
import { useUserSelectAdapter } from "@/entities/user";
import {
  type FilterFeature,
  createFixedSelectAdapter,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import { HISTORY_TYPES, HistoryFilterKeys, HistoryFilters } from "../../api";

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
    createdAt: {
      type: AutoFormValueType.dateRange,
      label: "Created",
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
    const createdAt = filters.createdAt as { from?: string; to?: string };
    const result: HistoryFilters = {
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
        from: createdAt?.from ? `${createdAt.from}T00:00:00` : "",
        to: createdAt?.to ? `${createdAt.to}T00:00:00` : "",
      },
    };
    return result;
  }

  return { buildFilterFields, mapFiltersToPayload };
}
