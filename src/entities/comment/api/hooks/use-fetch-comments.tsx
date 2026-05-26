import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import {
  CommentFilters,
  Comment_DETAILED,
  hydrateCommentFromMap,
} from "@/entities/comment";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useFetchComments = () => {
  const api = useContext(PrivateApiContext);

  const fetchCommentsByTwinId = useCallback(
    async ({
      twinId,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      twinId: string;
      pagination?: PaginationState;
      filters?: CommentFilters;
    }): Promise<PagedResponse<Comment_DETAILED>> => {
      try {
        const { data, error } = await api.comment.search({
          pagination,
          filters: {
            ...filters,
            ...(twinId ? { twinIdList: [twinId] } : {}),
          },
        });

        if (error) {
          throw new Error("Failed to fetch comments due to API error");
        }

        const comments =
          data.comments?.map((comment) =>
            hydrateCommentFromMap(comment, data.relatedObjects)
          ) ?? [];

        return {
          data: comments,
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error("Failed to fetch comments due to API error");
      }
    },
    [api]
  );

  return { fetchCommentsByTwinId };
};
