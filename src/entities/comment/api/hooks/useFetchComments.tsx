import {
  CommentView_DETAILED,
  hydrateCommentViewFromMap,
} from "@/entities/comment";
import { ApiContext, PagedResponse } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext } from "react";

export const useFetchComments = () => {
  const api = useContext(ApiContext);

  const fetchCommentsByTwinId = useCallback(
    async ({
      twinId,
      pagination = { pageIndex: 0, pageSize: 10 },
    }: {
      twinId: string;
      pagination?: PaginationState;
    }): Promise<PagedResponse<CommentView_DETAILED>> => {
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
            hydrateCommentViewFromMap(comment, data.relatedObjects)
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
