import { useCallback, useContext } from "react";

import { User_DETAILED } from "@/entities/user";
import { PrivateApiContext } from "@/shared/api";

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
    }: {
      filters?: DomainBusinessAccountUserFilters;
      groupField: DomainBusinessAccountUserCountGroupField;
    }): Promise<DomainBusinessAccountUserCountGroup[]> => {
      try {
        const { data, error } =
          await api.businessAccount.countDomainBusinessAccountUser({
            filters,
            groupFields: [groupField],
          });

        if (error) {
          throw new Error(
            "Failed to count business account users due to API error"
          );
        }

        const userMap = data.relatedObjects?.userMap;
        const businessAccountMap = data.relatedObjects?.businessAccountMap;

        return (data.counts ?? []).map((group) => ({
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
