import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { operations } from "@/shared/api/generated/schema";
import { PaginationState } from "@tanstack/table-core";

export function createFeaturerApi(settings: ApiSettings) {
  type SearchOptions =
    operations["featurerListV1"]["requestBody"]["content"]["application/json"];

  function search({
    pagination,
    options,
  }: {
    pagination: PaginationState;
    options: SearchOptions;
  }) {
    return settings.client.POST("/private/featurer/v1", {
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
