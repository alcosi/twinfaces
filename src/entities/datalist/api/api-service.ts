import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import {
  DataListCreateRqV1,
  DatalistFilters,
  DataListRqQuery,
} from "@/entities/datalist";

export function createDatalistApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: DatalistFilters;
  }) {
    return settings.client.POST("/private/data_list/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showDataListMode: "MANAGED",
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

  function getById({
    dataListId,
    query = {},
  }: {
    dataListId: string;
    query: DataListRqQuery;
  }) {
    return settings.client.GET(`/public/data_list/{dataListId}/v1`, {
      params: {
        header: { ...getApiDomainHeaders(settings), Locale: "en" },
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

  return { search, getById, create, update };
}

export type DatalistApi = ReturnType<typeof createDatalistApi>;
