import { PaginationState } from "@tanstack/table-core";

import {
  DataListOptionCountGroupField,
  DataListOptionCreateRqDV1,
  DataListOptionFilters,
  DataListOptionSortField,
} from "@/entities/datalist-option";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createDatalistOptionApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: DataListOptionFilters;
    sortField?: DataListOptionSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/data_list_option/search/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showDataListOptionMode: "DETAILED",
          showDataListOption2DataListMode: "MANAGED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        search: {
          ...filters,
        },
        sortField,
        sortDirection,
      },
    });
  }

  function count({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters: DataListOptionFilters;
    groupFields: DataListOptionCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/data_list_option/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showDataListOptionMode: "DETAILED",
          showDataListOption2DataListMode: "MANAGED",
          offset,
          limit,
          sortAsc,
        },
      },
      body: {
        search: {
          ...filters,
        },
        groupFields,
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
            lazyRelation: false,
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

  return { search, count, getById, create, update };
}

export type DatalistOptionApi = ReturnType<typeof createDatalistOptionApi>;
