import { PaginationState } from "@tanstack/table-core";

import {
  DataListOptionCreateRqDV1,
  DataListOptionFilters,
} from "@/entities/datalist-option";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

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
          showDataListOption2DataListMode: "MANAGED",
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
            showDataListOption2DataListMode: "DETAILED",
          },
        },
      }
    );
  }

  function create({ body }: { body: DataListOptionCreateRqDV1 }) {
    return settings.client.POST("/private/data_list_option/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update({
    dataListOptionId,
    body,
  }: {
    dataListOptionId: string;
    body: DataListOptionCreateRqDV1;
  }) {
    return settings.client.PUT(
      "/private/data_list_option/{dataListOptionId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { dataListOptionId },
        },
        body,
      }
    );
  }

  return { search, getById, create, update };
}

export type DatalistOptionApi = ReturnType<typeof createDatalistOptionApi>;
