import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import {
  CreateLinkRequestBody,
  LinkSearchFilters,
  QueryLinkViewV1,
  UpdateLinkRequestBody,
} from "./types";

export function createTwinClassLinksApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: LinkSearchFilters;
  }) {
    return settings.client.POST("/private/link/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showLinkMode: "MANAGED",
          showLinkSrc2TwinClassMode: "DETAILED",
          showLinkDst2TwinClassMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: { ...filters },
    });
  }

  const getLinks = async ({ twinClassId }: { twinClassId: string }) => {
    return settings.client.GET("/private/twin_class/{twinClassId}/link/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassId },
        query: {
          showLinkDst2TwinClassMode: "MANAGED",
          showLinkMode: "DETAILED",
        },
      },
    });
  };

  async function create({ body }: { body: CreateLinkRequestBody }) {
    return settings.client.POST("/private/link/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
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

  return { search, getLinks, create, update, getById };
}

export type TwinClassLinkApi = ReturnType<typeof createTwinClassLinksApi>;
