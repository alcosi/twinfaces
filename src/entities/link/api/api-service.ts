import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { CreateLinkRequestBody, LinkFilters } from "./types";

export function createLinkApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: LinkFilters;
  }) {
    return settings.client.POST("/private/link/search/v1", {
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
        ...filters,
      },
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

  return { search, create };
}

export type LinkApi = ReturnType<typeof createLinkApi>;
