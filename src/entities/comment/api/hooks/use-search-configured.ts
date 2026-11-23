import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { Comment_DETAILED, hydrateCommentFromMap } from "@/entities/comment";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useCommentSearchConfigured = () => {
  const api = useContext(PrivateApiContext);

  const searchCommentsConfigured = useCallback(
    async ({
      searchId,
      params,
      pagination = { pageIndex: 0, pageSize: 10 },
    }: {
      searchId: string;
      params?: Record<string, string>;
      pagination?: PaginationState;
    }): Promise<PagedResponse<Comment_DETAILED>> => {
      const { data, error } = await api.comment.searchConfigured({
        searchId,
        params,
        pagination,
      });

      if (error) {
        throw new Error("Failed to fetch comments due to API error");
      }

      if (!data) {
        throw new Error("Response has no data");
      }

      return {
        data:
          data.comments?.map((dto) =>
            hydrateCommentFromMap(dto, data.relatedObjects)
          ) ?? [],
        pagination: data.pagination ?? {},
      };
    },
    [api]
  );

  return { searchCommentsConfigured };
};
