import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryFilters } from "@/entities/factory";
import { operations } from "@/shared/api/generated/schema";

export function createFactoryApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryFilters;
  }) {
    return settings.client.POST("/private/factory/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryMode: "DETAILED",
          showFactory2UserMode: "DETAILED",
          showFactoryUsagesCountMode: "SHOW",
          showFactoryBranchesCountMode: "SHOW",
          showFactoryErasersCountMode: "SHOW",
          showFactoryMultipliersCountMode: "SHOW",
          showFactoryPipelinesCountMode: "SHOW",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
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
    query?: operations["factoryViewV1"]["parameters"]["query"];
  }) {
    return settings.client.GET("/private/factory/{factoryId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { factoryId: id },
        query: query,
      },
    });
  }

  return { search, getById };
}

export type FactoryApi = ReturnType<typeof createFactoryApi>;
