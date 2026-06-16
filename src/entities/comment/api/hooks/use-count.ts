import { useCallback, useContext } from "react";

import { CommentCountGroupField, CommentFilters } from "@/entities/comment";
import { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { CountResult, PrivateApiContext } from "@/shared/api";

/** A single server-aggregated comment group, hydrated with its entity. */
export type CommentCountGroup = {
  count: number;
  twinId?: string;
  createdByUserId?: string;
  twin?: Twin;
  author?: User;
};

export function useCommentCount() {
  const api = useContext(PrivateApiContext);

  const countComment = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: CommentFilters;
      groupField: CommentCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<CommentCountGroup>> => {
      try {
        const { data, error } = await api.comment.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count comments due to API error");
        }

        const related = data.relatedObjects;
        const counts = data.counts ?? [];

        const items = counts.map((group) => ({
          count: group.count ?? 0,
          twinId: group.twinId,
          createdByUserId: group.createdByUserId,
          twin:
            group.twinId && related?.twinMap
              ? (related.twinMap[group.twinId] as Twin)
              : undefined,
          author:
            group.createdByUserId && related?.userMap
              ? (related.userMap[group.createdByUserId] as User)
              : undefined,
        }));

        return {
          items,
          total: data.pagination?.total ?? items.length,
        };
      } catch {
        throw new Error("An error occured while counting comments");
      }
    },
    [api]
  );

  return { countComment };
}
