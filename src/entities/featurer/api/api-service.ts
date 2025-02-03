import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { FeaturerFilters } from "./types";

export function createFeaturerApi(settings: ApiSettings) {
  function search({
    pagination,
    options,
  }: {
    pagination: PaginationState;
    options: FeaturerFilters;
  }) {
    return settings.client.POST("/private/featurer/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
          showFeaturerMode: "DETAILED",
          showFeaturerParamMode: "SHOW",
        },
      },
      body: options,
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
    getById,
    create,
    update,
  };
}

export type FeaturerApi = ReturnType<typeof createFeaturerApi>;
