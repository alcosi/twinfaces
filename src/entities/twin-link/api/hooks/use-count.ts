import { useCallback, useContext } from "react";

import { Link } from "@/entities/link";
import type { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { TwinLinkCountGroupField, TwinLinkFilters } from "../types";

/** A single server-aggregated twin-link group, hydrated with its entity. */
export type TwinLinkCountGroup = {
  count: number;
  srcTwinId?: string;
  dstTwinId?: string;
  linkId?: string;
  createdByUserId?: string;
  srcTwin?: Twin;
  dstTwin?: Twin;
  link?: Link;
  createdByUser?: User;
};

export function useTwinLinkCount() {
  const api = useContext(PrivateApiContext);

  const countTwinLinks = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: TwinLinkFilters;
      groupField: TwinLinkCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<TwinLinkCountGroup>> => {
      try {
        const { data, error } = await api.twinLink.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count twin links due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const related = data.relatedObjects;

        const items = (data.counts ?? []).map((group) => ({
          count: group.count ?? 0,
          srcTwinId: group.srcTwinId,
          dstTwinId: group.dstTwinId,
          linkId: group.linkId,
          createdByUserId: group.createdByUserId,
          srcTwin:
            group.srcTwinId && related?.twinMap
              ? (related.twinMap[group.srcTwinId] as Twin)
              : undefined,
          dstTwin:
            group.dstTwinId && related?.twinMap
              ? (related.twinMap[group.dstTwinId] as Twin)
              : undefined,
          link:
            group.linkId && related?.linkMap
              ? (related.linkMap[group.linkId] as Link)
              : undefined,
          createdByUser:
            group.createdByUserId && related?.userMap
              ? related.userMap[group.createdByUserId]
              : undefined,
        }));

        return { items, total: data.pagination?.total ?? items.length };
      } catch {
        throw new Error("An error occurred while counting twin links");
      }
    },
    [api]
  );

  return { countTwinLinks };
}
