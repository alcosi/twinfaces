import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  CreateLinkRequestBody,
  LinkCountGroupField,
  LinkFilters,
  LinkSortField,
  QueryLinkViewV1,
  UpdateLinkRequestBody,
} from "./types";

export function createLinkApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: LinkFilters;
    sortField?: LinkSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/link/search/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showLinkMode: "MANAGED",
          showLink2UserMode: "DETAILED",
          showLinkDst2TwinClassMode: "DETAILED",
          showLinkSrc2TwinClassMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        search: { ...filters },
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
    filters: LinkFilters;
    groupFields: LinkCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/link/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showLinkMode: "MANAGED",
          showLinkSrc2TwinClassMode: "DETAILED",
          showLinkDst2TwinClassMode: "DETAILED",
          showLink2UserMode: "DETAILED",
          offset,
          limit,
          sortAsc,
        },
      },
      body: {
        search: { ...filters },
        groupFields,
      },
    });
  }

  async function update({
    linkId,
    body,
  }: {
    linkId: string;
    body: UpdateLinkRequestBody;
  }) {
    return settings.client.PUT("/private/link/{linkId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { linkId },
      },
      body: body,
    });
  }

  async function create({ body }: { body: CreateLinkRequestBody }) {
    return settings.client.POST("/private/link/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function getById({
    linkId,
    query = {},
  }: {
    linkId: string;
    query: QueryLinkViewV1;
  }) {
    return settings.client.GET("/private/link/{linkId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { linkId },
        query: query,
      },
    });
  }

  return { search, count, create, update, getById };
}

export type LinkApi = ReturnType<typeof createLinkApi>;
