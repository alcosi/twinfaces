import { PaginationState } from "@tanstack/table-core";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  CommentCountGroupField,
  CommentFilters,
  CommentSortField,
} from "./types";

// Show-modes shared by the search and count endpoints so that the related
// objects (author user, twin) come back hydrated for both the comment cards
// and the grouped-count breakdown.
const COMMENT_RELATION_MODES = {
  lazyRelation: false,
  showCommentMode: "DETAILED",
  showComment2UserMode: "DETAILED",
  showComment2TwinMode: "DETAILED",
  showCommentActionMode: "SHOW",
  showTwin2UserMode: "DETAILED",
} as const;

export function createCommentApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: CommentFilters;
    sortField?: CommentSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/comment/search/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          ...COMMENT_RELATION_MODES,
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
        sortField,
        sortDirection,
      },
    });
  }

  function count({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters: CommentFilters;
    groupFields: CommentCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/comment/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          ...COMMENT_RELATION_MODES,
          offset,
          limit,
          sortAsc,
        },
      },
      body: {
        search: {
          ...filters,
        },
        groupFields,
      },
    });
  }

  function getById({
    twinId,
    pagination,
  }: {
    twinId: string;
    pagination: PaginationState;
  }) {
    return settings.client.GET("/private/comment/twin/{twinId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId },
        query: {
          lazyRelation: false,
          showStatusMode: "DETAILED",
          showCommentMode: "DETAILED",
          showComment2UserMode: "DETAILED",
          showTwinCommentActionMode: "SHOW",
          showTwinAttachmentActionMode: "SHOW",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
    });
  }

  function create() {
    // TODO: Add implementation
  }

  function update() {
    // TODO: Add implementation
  }

  return {
    search,
    count,
    getById,
    create,
    update,
  };
}

export type CommentApi = ReturnType<typeof createCommentApi>;
