import { PaginationState } from "@tanstack/table-core";

import {
  DataListCountGroupField,
  DataListCreateRqV1,
  DataListRqQuery,
  DataListSortField,
  DatalistFilters,
} from "@/entities/datalist";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createDatalistApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: DatalistFilters;
    sortField?: DataListSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/data_list/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          showDataListMode: "MANAGED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: {
        search: { ...filters },
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
    filters: DatalistFilters;
    groupFields: DataListCountGroupField[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/data_list/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showDataListMode: "MANAGED",
          showDataList2UserMode: "DETAILED",
          offset,
          limit,
          sortAsc,
        },
      },
      body: {
        search: { ...filters },
        groupFields,
      },
    });
  }

  function getById({
    dataListId,
    query = {},
  }: {
    dataListId: string;
    query: DataListRqQuery;
  }) {
    return settings.client.GET(`/private/data_list/{dataListId}/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { dataListId },
        query,
      },
    });
  }

  function create({ body }: { body: DataListCreateRqV1 }) {
    return settings.client.POST("/private/data_list/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body,
    });
  }

  function update({
    dataListId,
    body,
  }: {
    dataListId: string;
    body: DataListCreateRqV1;
  }) {
    return settings.client.PUT("/private/data_list/{dataListId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { dataListId },
      },
      body,
    });
  }

  return { search, count, getById, create, update };
}

export type DatalistApi = ReturnType<typeof createDatalistApi>;
