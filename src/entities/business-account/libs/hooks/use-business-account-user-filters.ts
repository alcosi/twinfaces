import { AutoFormValueInfo, AutoFormValueType } from "@/components/auto-field";

import { useUserSelectAdapter } from "@/entities/user";
import { useUserGroupSelectAdapter } from "@/entities/user-group";
import { DataTimeRangeV1 } from "@/shared/api";
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
    lastActivityAtFrom: {
      type: AutoFormValueType.string,
      label: "Last activity from",
      input_props: { type: "date" },
    },
    lastActivityAtTo: {
      type: AutoFormValueType.string,
      label: "Last activity to",
      input_props: { type: "date" },
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
    const result: DomainBusinessAccountUserFilters & {
      createdAt: DataTimeRangeV1;
      lastActivityAt: DataTimeRangeV1;
    } = {
      businessAccountIdList: toArrayOfString(
        toArray(filters.businessAccountIdList),
        "id"
      ),
      userIdList: toArrayOfString(toArray(filters.userIdList), "userId"),
      userGroupIdList: toArrayOfString(toArray(filters.userGroupIdList), "id"),
      createdAt: {
        from: filters.createdAtFrom ? `${filters.createdAtFrom}T00:00:00` : "",
        to: filters.createdAtTo ? `${filters.createdAtTo}T00:00:00` : "",
      },
      lastActivityAt: {
        from: filters.lastActivityAtFrom
          ? `${filters.lastActivityAtFrom}T00:00:00`
          : "",
        to: filters.lastActivityAtTo
          ? `${filters.lastActivityAtTo}T00:00:00`
          : "",
      },
    };

    return result;
  }

  return { buildFilterFields, mapFiltersToPayload };
}
