import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  DomainBusinessAccountFilters,
  DomainBusinessAccountUserFilters,
} from "./types";

export function createBusinessAccountApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: DomainBusinessAccountFilters;
  }) {
    return settings.client.POST(`/private/domain/business_account/search/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showDomainBusinessAccountMode: "DETAILED",
          showDomainBusinessAccount2BusinessAccountMode: "DETAILED",
          showDomainBusinessAccount2PermissionSchemaMode: "DETAILED",
          showDomainBusinessAccount2TwinflowSchemaMode: "DETAILED",
          showDomainBusinessAccount2TwinClassSchemaMode: "DETAILED",
          showDomainBusinessAccount2NotificationSchemaMode: "DETAILED",
          showDomainBusinessAccount2TierMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
      },
    });
  }

  function searchDomainBusinessAccountUser({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: DomainBusinessAccountUserFilters;
  }) {
    return settings.client.POST(
      `/private/domain/business_account_user/search/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showDomainBusinessAccountUser2BusinessAccountMode: "DETAILED",
            showDomainBusinessAccountUser2UserGroupMode: "DETAILED",
            showDomainBusinessAccountUser2UserMode: "DETAILED",
            showDomainBusinessAccountUserMode: "DETAILED",
            showUser2UserGroupMode: "DETAILED",
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
          },
        },
        body: {
          search: {
            ...filters,
          },
        },
      }
    );
  }

  return { search, searchDomainBusinessAccountUser };
}

export type BusinessAccountApi = ReturnType<typeof createBusinessAccountApi>;
