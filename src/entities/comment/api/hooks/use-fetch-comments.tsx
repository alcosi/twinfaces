import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

import { Comment_DETAILED, hydrateCommentFromMap } from "@/entities/comment";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useFetchComments = () => {
  const api = useContext(PrivateApiContext);

  const fetchCommentsByTwinId = useCallback(
    async ({
      twinId,
      pagination = { pageIndex: 0, pageSize: 10 },
    }: {
      twinId: string;
      pagination?: PaginationState;
    }): Promise<PagedResponse<Comment_DETAILED>> => {
      try {
        const { data, error } = await api.comment.getById({
          twinId,
          pagination,
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
      } catch (error) {
        throw new Error("Failed to fetch comments due to API error");
      }
    },
    [api]
  );

  return { fetchCommentsByTwinId };
};
