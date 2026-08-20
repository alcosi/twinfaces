import { useCallback, useContext } from "react";

import type { BusinessAccount } from "@/entities/business-account";
import type { TwinClass_DETAILED } from "@/entities/twin-class";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { SpaceRoleCountGroupField, SpaceRoleFilters } from "../types";

/** One server-aggregated space-role group, hydrated with its related entity. */
export type SpaceRoleCountGroup = {
  count: number;
  twinClassId?: string;
  businessAccountId?: string;
  twinClass?: TwinClass_DETAILED;
  businessAccount?: BusinessAccount;
};

export function useSpaceRoleCount() {
  const api = useContext(PrivateApiContext);

  const countSpaceRoles = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: SpaceRoleFilters;
      groupField: SpaceRoleCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<SpaceRoleCountGroup>> => {
      try {
        const { data, error } = await api.spaceRole.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count space roles due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const twinClassMap = data.relatedObjects?.twinClassMap;
        const businessAccountMap = data.relatedObjects?.businessAccountMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          twinClassId: group.twinClassId,
          businessAccountId: group.businessAccountId,
          twinClass:
            group.twinClassId && twinClassMap
              ? (twinClassMap[group.twinClassId] as TwinClass_DETAILED)
              : undefined,
          businessAccount:
            group.businessAccountId && businessAccountMap
              ? (businessAccountMap[group.businessAccountId] as BusinessAccount)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occured while counting space roles");
      }
    },
    [api]
  );

  return { countSpaceRoles };
}
