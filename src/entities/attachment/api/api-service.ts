import { PaginationState } from "@tanstack/table-core";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  AttachmentCountGroupField,
  AttachmentFilters,
  AttachmentRqQuery,
  AttachmentSortField,
} from "../libs";

// Show-modes shared by the search and count endpoints so that the related
// objects (twin, transition, author, permission, comment, field) come back
// hydrated for both the table rows and the grouped-count breakdown.
const ATTACHMENT_RELATION_MODES = {
  lazyRelation: false,
  showAttachmentMode: "DETAILED",
  showAttachment2TwinMode: "DETAILED",
  showAttachment2TransitionMode: "DETAILED",
  showAttachment2UserMode: "DETAILED",
  showAttachment2PermissionMode: "DETAILED",
  showAttachment2CommentModeMode: "DETAILED",
  showAttachmentCollectionMode: "ALL",
  showTwinClass2TwinClassFieldMode: "DETAILED",
  showTwinClassFieldCollectionMode: "SHOW",
  showTwin2TwinClassMode: "DETAILED",
} as const;

export function createAttachmentApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: AttachmentFilters;
    sortField?: AttachmentSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/attachment/search/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          ...ATTACHMENT_RELATION_MODES,
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
    filters: AttachmentFilters;
    groupFields: AttachmentCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/attachment/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          ...ATTACHMENT_RELATION_MODES,
          showAttachment2TwinClassFieldMode: "DETAILED",
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

  return {
    search,
    count,
    getById,
  };
}

export type AttachmentApi = ReturnType<typeof createAttachmentApi>;
