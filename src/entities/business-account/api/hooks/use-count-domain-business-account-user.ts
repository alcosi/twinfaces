import { useCallback, useContext } from "react";

import { User_DETAILED } from "@/entities/user";
import { CountResult, PrivateApiContext } from "@/shared/api";

import {
  BusinessAccount,
  DomainBusinessAccountUserCountGroupField,
  DomainBusinessAccountUserFilters,
} from "../types";

/** A single server-aggregated group, hydrated with its related entity. */
export type DomainBusinessAccountUserCountGroup = {
  count: number;
  userId?: string;
  businessAccountId?: string;
  user?: User_DETAILED;
  businessAccount?: BusinessAccount;
};

export function useBusinessAccountUserCount() {
  const api = useContext(PrivateApiContext);

  const countBusinessAccountUser = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: DomainBusinessAccountUserFilters;
      groupField: DomainBusinessAccountUserCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<DomainBusinessAccountUserCountGroup>> => {
      try {
        const { data, error } =
          await api.businessAccount.countDomainBusinessAccountUser({
            filters,
            groupFields: [groupField],
            offset,
            limit,
            sortAsc,
          });

        if (error) {
          throw new Error(
            "Failed to count business account users due to API error"
          );
        }

        const userMap = data.relatedObjects?.userMap;
        const businessAccountMap = data.relatedObjects?.businessAccountMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          userId: group.userId,
          businessAccountId: group.businessAccountId,
          user:
            group.userId && userMap
              ? (userMap[group.userId] as User_DETAILED)
              : undefined,
          businessAccount:
            group.businessAccountId && businessAccountMap
              ? (businessAccountMap[group.businessAccountId] as BusinessAccount)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error(
          "An error occured while counting business account users"
        );
      }
    },
    [api]
  );

  return { countBusinessAccountUser };
}
