import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { TransitionAliasFilters } from "./types";

export function createTransitionAliasApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: TransitionAliasFilters;
  }) {
    return settings.client.POST("/private/transition_alias/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          showTransitionAliasMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: { ...filters },
    });
  }

  return {
    search,
  };
}

export type TransitionAliasApi = ReturnType<typeof createTransitionAliasApi>;
