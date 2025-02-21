import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { FactoryBranchCreateRq, FactoryBranchFilters } from "./types";

export function createFactoryBranchApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryBranchFilters;
  }) {
    return settings.client.POST("/private/factory_branch/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryBranch2FactoryConditionSetMode: "DETAILED",
          showFactoryBranch2FactoryMode: "DETAILED",
          showFactoryBranchMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  function create({ id, body }: { id: string; body: FactoryBranchCreateRq }) {
    return settings.client.POST(
      `/private/factory/{factoryId}/factory_branch/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryId: id },
        },
        body: body,
      }
    );
  }

  return { search, create };
}

export type FactoryBranchApi = ReturnType<typeof createFactoryBranchApi>;
