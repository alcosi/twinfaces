import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { FactorySearchRq } from "@/entities/factory";
import { PaginationState } from "@tanstack/react-table";

type FactorySearchFilters = Partial<
  Pick<
    FactorySearchRq,
    "idList" | "nameLikeList" | "descriptionLikeList" | "keyLikeList"
  >
>;

export function createFactoryApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactorySearchFilters;
  }) {
    return settings.client.POST("/private/factory/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
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

  return { search };
}

export type FactoryApi = ReturnType<typeof createFactoryApi>;
