import { useCallback, useContext } from "react";

import type { Factory } from "@/entities/factory/api";
import type { User } from "@/entities/user";
import { CountResult, PrivateApiContext } from "@/shared/api";

import {
  FactoryConditionSetCountGroupField,
  FactoryConditionSetFilters,
} from "../types";

/** A single server-aggregated factory condition set group, hydrated with its related entity. */
export type FactoryConditionSetCountGroup = {
  count: number;
  twinFactoryId?: string;
  cachable?: boolean;
  createdByUserId?: string;
  factory?: Factory;
  createdByUser?: User;
};

export function useFactoryConditionSetCount() {
  const api = useContext(PrivateApiContext);

  const countFactoryConditionSets = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: FactoryConditionSetFilters;
      groupField: FactoryConditionSetCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<FactoryConditionSetCountGroup>> => {
      try {
        const { data, error } = await api.factoryConditionSet.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error(
            "Failed to count factory condition sets due to API error"
          );
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const factoryMap = data.relatedObjects?.factoryMap;
        const userMap = data.relatedObjects?.userMap;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          twinFactoryId: group.twinFactoryId,
          cachable: group.cachable,
          createdByUserId: group.createdByUserId,
          factory:
            group.twinFactoryId && factoryMap
              ? (factoryMap[group.twinFactoryId] as Factory)
              : undefined,
          createdByUser:
            group.createdByUserId && userMap
              ? (userMap[group.createdByUserId] as User)
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error(
          "An error occured while counting factory condition sets"
        );
      }
    },
    [api]
  );

  return { countFactoryConditionSets };
}
