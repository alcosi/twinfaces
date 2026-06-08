import { useCallback, useContext } from "react";

import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinStatus } from "@/entities/twin-status";
import { TwinFilters, Twin_DETAILED } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { PrivateApiContext } from "@/shared/api";

/**
 * The raw grouped-count rows the endpoint returns. Each row carries the count
 * plus the static projection matching the requested `groupField` (dynamic
 * field grouping is not modelled here yet).
 */
type RawTwinCount = {
  count?: number;
  twinClassId?: string;
  twinStatusId?: string;
  ownerBusinessAccountId?: string;
  ownerUserId?: string;
  createdByUserId?: string;
  assignerUserId?: string;
  headTwinId?: string;
};

/** A single server-aggregated group, hydrated with its related entity. */
export type TwinCountGroup = RawTwinCount & {
  count: number;
  twinClass?: TwinClass_DETAILED;
  status?: TwinStatus;
  ownerUser?: User;
  createdByUser?: User;
  assignerUser?: User;
  headTwin?: Twin_DETAILED;
};

export function useTwinCount() {
  const api = useContext(PrivateApiContext);

  const countTwins = useCallback(
    async ({
      filters = {},
      groupField,
    }: {
      filters?: TwinFilters;
      groupField: string;
    }): Promise<TwinCountGroup[]> => {
      try {
        const { data, error } = await api.twin.count({
          filters,
          groupFields: [groupField],
        });

        if (error) {
          throw new Error("Failed to count twins due to API error");
        }

        const related = data.relatedObjects;
        const counts = (data.counts ?? []) as RawTwinCount[];

        return counts.map((group) => ({
          ...group,
          count: group.count ?? 0,
          twinClass:
            group.twinClassId && related?.twinClassMap
              ? (related.twinClassMap[group.twinClassId] as TwinClass_DETAILED)
              : undefined,
          status:
            group.twinStatusId && related?.statusMap
              ? (related.statusMap[group.twinStatusId] as TwinStatus)
              : undefined,
          ownerUser:
            group.ownerUserId && related?.userMap
              ? (related.userMap[group.ownerUserId] as User)
              : undefined,
          createdByUser:
            group.createdByUserId && related?.userMap
              ? (related.userMap[group.createdByUserId] as User)
              : undefined,
          assignerUser:
            group.assignerUserId && related?.userMap
              ? (related.userMap[group.assignerUserId] as User)
              : undefined,
          headTwin:
            group.headTwinId && related?.twinMap
              ? (related.twinMap[group.headTwinId] as Twin_DETAILED)
              : undefined,
        }));
      } catch {
        throw new Error("An error occured while counting twins");
      }
    },
    [api]
  );

  return { countTwins };
}
