import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  DomainUserFilters,
  DomainUserViewQuery,
  PermissionGrantUserFilters,
  User,
  UserPermissionListQuery,
} from "./types";

export function createUserApi(settings: ApiSettings) {
  async function searchDomainUsers({
    pagination,
    filters,
    header,
  }: {
    pagination: PaginationState;
    filters: DomainUserFilters;
    header?: ReturnType<typeof getApiDomainHeaders>;
  }) {
    return settings.client.POST("/private/domain/user/search/v1", {
      params: {
        header: header ?? getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showDomainUser2UserMode: "DETAILED",
          showDomainUserMode: "DETAILED",
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

  async function searchPermissionGrants({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: PermissionGrantUserFilters;
  }) {
    return settings.client.POST("/private/permission_grant/user/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showPermissionGrantUser2PermissionSchemaMode: "DETAILED",
          showPermissionGrantUser2PermissionMode: "DETAILED",
          showPermissionGrantUser2UserGroupMode: "DETAILED",
          showPermissionGrantUser2UserMode: "DETAILED",
          showPermissionGrantUserMode: "DETAILED",
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
    id,
    query = {},
  }: {
    id: string;
    query?: DomainUserViewQuery;
  }) {
    return settings.client.GET(`/private/domain/user/{userId}/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { userId: id },
        query: query,
      },
    });
  }

  function update({ id, body }: { id: string; body: User }) {
    return settings.client.PUT(`/private/user/{userId}/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { userId: id },
      },
      body: body,
    });
  }

  function getPermissionUserById({
    userId,
    query = {},
  }: {
    userId: string;
    query?: UserPermissionListQuery;
  }) {
    return settings.client.GET(`/private/user/{userId}/permission/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { userId },
        query: query,
      },
    });
  }

  return {
    searchDomainUsers,
    searchPermissionGrants,
    getById,
    update,
    getPermissionUserById,
  };
}

export type UserApi = ReturnType<typeof createUserApi>;
