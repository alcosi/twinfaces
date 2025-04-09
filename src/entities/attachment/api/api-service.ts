import { PaginationState } from "@tanstack/table-core";

import { AttachmentFilters, AttachmentRqQuery } from "@/entities/attachment";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createAttachmentApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: AttachmentFilters;
  }) {
    return settings.client.POST("/private/attachment/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showAttachmentMode: "DETAILED",
          showAttachment2TwinMode: "DETAILED",
          showAttachment2TransitionMode: "DETAILED",
          showAttachment2UserMode: "DETAILED",
          showAttachment2PermissionMode: "DETAILED",
          showAttachment2CommentModeMode: "DETAILED",
          showAttachmentCollectionMode: "ALL",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwin2TwinClassMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  function getById({
    attachmentId,
    query,
  }: {
    attachmentId: string;
    query: AttachmentRqQuery;
  }) {
    return settings.client.GET("/private/attachment/{attachmentId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { attachmentId },
        query,
      },
    });
  }

  return { search, getById };
}

export type AttachmentApi = ReturnType<typeof createAttachmentApi>;
