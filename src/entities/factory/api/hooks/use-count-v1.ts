import { useCallback, useContext } from "react";

import { User } from "@/entities/user";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { FactoryCountGroupField, FactoryFilters } from "../types";

/** A single server-aggregated factory group, hydrated with its related entity. */
export type FactoryCountGroup = {
  count: number;
  createdByUserId?: string;
  createdByUser?: User;
};

export function useFactoryCount() {
  const api = useContext(PrivateApiContext);

  const countFactories = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: FactoryFilters;
      groupField: FactoryCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<FactoryCountGroup>> => {
      try {
        const { data, error } = await api.factory.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count factories due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const userMap = data.relatedObjects?.userMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          createdByUserId: group.createdByUserId,
          createdByUser:
            group.createdByUserId && userMap
              ? (userMap[group.createdByUserId] as User)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occurred while counting factories");
      }
    },
    [api]
  );

  return { countFactories };
}
