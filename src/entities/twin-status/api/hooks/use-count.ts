import { useCallback, useContext } from "react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { CountResult, PrivateApiContext } from "@/shared/api";
import { components } from "@/shared/api/generated/schema";

import { TwinStatusCountGroupField, TwinStatusFilters } from "../types";

type RawTwinStatusCount = components["schemas"]["TwinStatusCountV1"];

/** A single server-aggregated group, hydrated with its related entity. */
export type TwinStatusCountGroup = RawTwinStatusCount & {
  count: number;
  twinClass?: TwinClass_DETAILED;
};

export function useTwinStatusCount() {
  const api = useContext(PrivateApiContext);

  const countTwinStatuses = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: TwinStatusFilters;
      groupField: TwinStatusCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<TwinStatusCountGroup>> => {
      const { data, error } = await api.twinStatus.count({
        filters,
        groupFields: [groupField],
        offset,
        limit,
        sortAsc,
      });

      if (error) {
        throw new Error("Failed to count statuses due to API error");
      }

      const related = data.relatedObjects;
      const counts = data.counts ?? [];

      const items = counts.map((group) => ({
        ...group,
        count: group.count ?? 0,
        twinClass:
          group.twinClassId && related?.twinClassMap
            ? (related.twinClassMap[group.twinClassId] as TwinClass_DETAILED)
            : undefined,
      }));

      return { items, total: data.pagination?.total ?? items.length };
    },
    [api]
  );

  return { countTwinStatuses };
}
