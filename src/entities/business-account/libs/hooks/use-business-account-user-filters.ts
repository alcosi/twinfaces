import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import {
  useUserFilters,
  useUserSelectAdapterWithFilters,
} from "@/entities/user";
import { useUserGroupSelectAdapter } from "@/entities/user-group";
import {
  FilterFeature,
  extractEnabledFilters,
  isPopulatedArray,
  toArray,
  toArrayOfString,
} from "@/shared/libs";

import {
  DomainBusinessAccountUserFilterKeys,
  DomainBusinessAccountUserFilters,
} from "../../api";
import { useBusinessAccountFilters } from "./use-filters";
import { useBusinessAccountSelectAdapterWithFilters } from "./use-select-adapter-with-filters";

export function useBusinessAccountUserFilters({
  enabledFilters,
}: {
  enabledFilters?: DomainBusinessAccountUserFilterKeys[];
}): FilterFeature<
  DomainBusinessAccountUserFilterKeys,
  DomainBusinessAccountUserFilters
> {
  const userAdapter = useUserSelectAdapterWithFilters();
  const userGroupAdapter = useUserGroupSelectAdapter();
  const businessAccoutAdapter = useBusinessAccountSelectAdapterWithFilters();

  const {
    buildFilterFields: buildBusinessAccountFilters,
    mapFiltersToPayload: mapBusinessAccountFilters,
  } = useBusinessAccountFilters();
  const {
    buildFilterFields: buildUserFilters,
    mapFiltersToPayload: mapUserFilters,
  } = useUserFilters();

  const allFilters: Record<
    DomainBusinessAccountUserFilterKeys,
    AutoFormValueInfo
  > = {
    businessAccountIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "Business account",
      adapter: businessAccoutAdapter,
      extraFilters: buildBusinessAccountFilters(),
      mapExtraFilters: (filters) => mapBusinessAccountFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    userIdList: {
      type: AutoFormValueType.complexCombobox,
      label: "User",
      adapter: userAdapter,
      extraFilters: buildUserFilters(),
      mapExtraFilters: (filters) => mapUserFilters(filters),
      searchPlaceholder: "Search...",
      selectPlaceholder: "Select...",
      multi: true,
    },
    userGroupIdList: {
      type: AutoFormValueType.combobox,
      label: "User group",
      multi: true,
      ...userGroupAdapter,
    },
    createdAt: {
      type: AutoFormValueType.dateRange,
      label: "Created",
    },
    lastActivityAt: {
      type: AutoFormValueType.dateRange,
      label: "Last activity",
    },
  };

  function buildFilterFields(): Record<
    DomainBusinessAccountUserFilterKeys,
    AutoFormValueInfo
  > {
    return isPopulatedArray(enabledFilters)
      ? extractEnabledFilters(enabledFilters, allFilters)
      : allFilters;
  }

  function mapFiltersToPayload(
    filters: Record<string, unknown>
  ): DomainBusinessAccountUserFilters {
    const createdAt = filters.createdAt as { from?: string; to?: string };
    const lastActivityAt = filters.lastActivityAt as {
      from?: string;
      to?: string;
    };
    const result: DomainBusinessAccountUserFilters = {
      businessAccountIdList: toArrayOfString(
        toArray(filters.businessAccountIdList),
        "id"
      ),
      userIdList: toArrayOfString(toArray(filters.userIdList), "userId"),
      userGroupIdList: toArrayOfString(toArray(filters.userGroupIdList), "id"),
      createdAt: {
        from: createdAt?.from ? `${createdAt.from}T00:00:00` : "",
        to: createdAt?.to ? `${createdAt.to}T00:00:00` : "",
      },
      lastActivityAt: {
        from: lastActivityAt?.from ? `${lastActivityAt.from}T00:00:00` : "",
        to: lastActivityAt?.to ? `${lastActivityAt.to}T00:00:00` : "",
      },
    };

    return result;
  }

  return { buildFilterFields, mapFiltersToPayload };
}
