import { PaginationState } from "@tanstack/react-table";

import {
  DomainAddRqV1,
  DomainUpdateRq,
  DomainViewQuery,
} from "@/entities/domain";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createDomainApi(settings: ApiSettings) {
  function search() {
    // TODO: Add implementation
  }

  function fetchList({ pagination }: { pagination: PaginationState }) {
    return settings.client.GET("/private/domain/list/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          showDomainMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
    });
  }

  function fetchTwinClassOwnerType() {
    return settings.client.GET("/private/domain/class_owner_type/list/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
    });
  }

  function getById({
    domainId,
    query = {},
  }: {
    domainId: string;
    query?: DomainViewQuery;
  }) {
    return settings.client.GET("/private/domain/{domainId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { domainId },
        query: query,
      },
    });
  }

  function create({ body }: { body: DomainAddRqV1 }) {
    return settings.client.POST("/private/domain/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update({ body }: { body: DomainUpdateRq }) {
    return settings.client.PUT("/private/domain/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function getLocaleList() {
    return settings.client.GET("/public/locale/list/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
    });
  }

  return {
    search,
    fetchList,
    getById,
    create,
    update,
    fetchTwinClassOwnerType,
    getLocaleList,
  };
}

export type DomainApi = ReturnType<typeof createDomainApi>;
