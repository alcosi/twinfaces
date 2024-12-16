import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";

export function createDomainApi(settings: ApiSettings) {
  function search() {
    // TODO: Add implementation
  }

  function fetchList({ pagination }: { pagination: PaginationState }) {
    return settings.client.GET("/private/domain/list/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          showDomainMode: "SHORT",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
    });
  }

  function getById() {
    // TODO: Add implementation
  }

  function create() {
    // TODO: Add implementation
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
  };
}

export type DomainApi = ReturnType<typeof createDomainApi>;
