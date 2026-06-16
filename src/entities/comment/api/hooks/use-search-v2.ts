import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import {
  CommentFilters,
  CommentSortField,
  Comment_DETAILED,
  hydrateCommentFromMap,
} from "@/entities/comment";
import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

export const useCommentSearchV2 = () => {
  const api = useContext(PrivateApiContext);

  const searchComments = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
      sort,
    }: {
      pagination?: PaginationState;
      filters?: CommentFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<Comment_DETAILED>> => {
      try {
        const { data, error } = await api.comment.search({
          pagination,
          filters,
          sortField: sort?.field as CommentSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw new Error("Failed to fetch comments due to API error");
        }

        const comments =
          data.comments?.map((dto) =>
            hydrateCommentFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: comments,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occurred while fetching comments: " + error);
      }
    },
    [api]
  );

  return { searchComments };
};
