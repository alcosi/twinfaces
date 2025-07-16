import { PaginationState } from "@tanstack/react-table";

import { DomainAddRqV1 } from "@/entities/domain";
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

  function getById() {
    // TODO: Add implementation
  }

  function create({ body }: { body: DomainAddRqV1 }) {
    return settings.client.POST("/private/domain/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update() {
    // TODO: Add implementation
  }

  return {
    search,
    fetchList,
    getById,
    create,
    update,
    fetchTwinClassOwnerType,
  };
}

export type DomainApi = ReturnType<typeof createDomainApi>;
