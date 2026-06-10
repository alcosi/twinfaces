import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  DomainBusinessAccountCountGroupField,
  DomainBusinessAccountFilters,
  DomainBusinessAccountUserCountGroupField,
  DomainBusinessAccountUserFilters,
} from "./types";

export function createBusinessAccountApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: DomainBusinessAccountFilters;
    sortField?:
      | "createdAt"
      | "businessAccountName"
      | "permissionSchemaName"
      | "twinClassSchemaName"
      | "twinflowSchemaName"
      | "notificationSchemaName"
      | "tierName"
      | "attachmentsStorageUsedCount"
      | "attachmentsStorageUsedSize";
    sortDirection?: "ASC" | "DESC";
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
        sortField,
        sortDirection,
      },
    });
  }

  function searchDomainBusinessAccountUser({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: DomainBusinessAccountUserFilters;
    sortField?:
      | "createdAt"
      | "lastActivityAt"
      | "userName"
      | "businessAccountName";
    sortDirection?: "ASC" | "DESC";
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
          sortField,
          sortDirection,
        },
      }
    );
  }

  function countDomainBusinessAccountUser({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters: DomainBusinessAccountUserFilters;
    groupFields: DomainBusinessAccountUserCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST(
      `/private/domain/business_account_user/count/v1`,
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
      }
    );
  }

  function countDomainBusinessAccount({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters: DomainBusinessAccountFilters;
    groupFields: DomainBusinessAccountCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST(`/private/domain/business_account/count/v1`, {
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

  return {
    search,
    searchDomainBusinessAccountUser,
    countDomainBusinessAccountUser,
    countDomainBusinessAccount,
  };
}

export type BusinessAccountApi = ReturnType<typeof createBusinessAccountApi>;
