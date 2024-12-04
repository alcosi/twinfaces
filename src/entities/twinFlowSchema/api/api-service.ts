import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import { TwinFlowSchemaFilters } from "./types";

export function createTwinFlowSchemaApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: TwinFlowSchemaFilters;
  }) {
    return settings.client.POST("/private/twinflow_schema/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinflowSchemaMode: "DETAILED",
          // showTwinflowSchema2UserMode: "SHORT",
          // showTwinflowSchema2BusinessAccountMode: "SHORT",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        ...filters,
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
    getById,
    create,
    update,
  };
}

export type TwinFlowSchemaApi = ReturnType<typeof createTwinFlowSchemaApi>;
