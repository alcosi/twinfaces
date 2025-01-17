import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { DataListOptionFilters } from "@/entities/datalist-option";

export function createDatalistOptionApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: DataListOptionFilters;
  }) {
    return settings.client.POST("/private/data_list_option/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showDataListOptionMode: "DETAILED",
          showDataListOption2DataListMode: "DETAILED",
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

  function getById({ dataListOptionId }: { dataListOptionId: string }) {
    return settings.client.GET(
      "/private/data_list_option/{dataListOptionId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { dataListOptionId },
          query: {
            showDataListOptionMode: "DETAILED",
          },
        },
      }
    );
  }

  return { search, getById };
}

export type DatalistOptionApi = ReturnType<typeof createDatalistOptionApi>;
