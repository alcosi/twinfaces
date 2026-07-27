import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  TwinLinkCountGroupField,
  TwinLinkFilters,
  TwinLinkSortField,
} from "./types";

// Show-modes shared by the search and count endpoints so both the table rows
// and the grouped-count breakdown come back with their related objects (link,
// source/destination twin, author) hydrated.
const TWIN_LINK_RELATION_MODES = {
  lazyRelation: false,
  showTwinLinkMode: "DETAILED",
  showTwinLink2LinkMode: "MANAGED",
  showTwinLink2TwinMode: "DETAILED",
  showTwinLink2UserMode: "DETAILED",
  showTwin2TwinClassMode: "DETAILED",
  showTwin2StatusMode: "DETAILED",
  showTwin2UserMode: "DETAILED",
} as const;

export function createTwinLinkApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: TwinLinkFilters;
    sortField?: TwinLinkSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/twin_link/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          ...TWIN_LINK_RELATION_MODES,
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
    filters: TwinLinkFilters;
    groupFields: TwinLinkCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/twin_link/search/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          ...TWIN_LINK_RELATION_MODES,
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

  return { search, count };
}

export type TwinLinkApi = ReturnType<typeof createTwinLinkApi>;
