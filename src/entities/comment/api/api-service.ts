import { PaginationState } from "@tanstack/table-core";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createCommentApi(settings: ApiSettings) {
  function search() {
    // TODO: Add implementation
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
    getById,
    create,
    update,
  };
}

export type CommentApi = ReturnType<typeof createCommentApi>;
