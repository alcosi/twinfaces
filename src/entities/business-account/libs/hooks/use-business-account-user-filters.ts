import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useUserSelectAdapter } from "@/entities/user";
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
import { useBusinessAccountSelectAdapter } from "./use-select-adapter";

export function useBusinessAccountUserFilters({
  enabledFilters,
}: {
  enabledFilters?: DomainBusinessAccountUserFilterKeys[];
}): FilterFeature<
  DomainBusinessAccountUserFilterKeys,
  DomainBusinessAccountUserFilters
> {
  const userAdapter = useUserSelectAdapter();
  const userGroupAdapter = useUserGroupSelectAdapter();
  const businessAccoutAdapter = useBusinessAccountSelectAdapter();

  const allFilters: Record<
    DomainBusinessAccountUserFilterKeys,
    AutoFormValueInfo
  > = {
    businessAccountIdList: {
      type: AutoFormValueType.combobox,
      label: "Business account",
      multi: true,
      ...businessAccoutAdapter,
    },
    userIdList: {
      type: AutoFormValueType.combobox,
      label: "User",
      multi: true,
      ...userAdapter,
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
