import { useCallback, useContext } from "react";

import type { User } from "@/entities/user";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { DataListCountGroupField, DatalistFilters } from "../types";

/** One server-aggregated datalist group, hydrated with its related entity. */
export type DataListCountGroup = {
  count: number;
  createdByUserId?: string;
  createdByUser?: User;
};

export const useDatalistCount = () => {
  const api = useContext(PrivateApiContext);

  const countDatalists = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: DatalistFilters;
      groupField: DataListCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<DataListCountGroup>> => {
      try {
        const { data, error } = await api.datalist.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count datalists due to API error");
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
        throw new Error("An error occured while counting datalists");
      }
    },
    [api]
  );

  return { countDatalists };
};
