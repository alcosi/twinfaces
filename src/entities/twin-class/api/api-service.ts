import { PaginationState } from "@tanstack/table-core";

import { TwinSimpleFilters } from "@/entities/twin/api";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { operations } from "@/shared/api/generated/schema";

import {
  TagSearchFilters,
  TwinClassCreateRq,
  TwinClassFilters,
  TwinClassUpdateRq,
  TwinClassValidHeadFilters,
  TwinClassValidHeadQuery,
} from "./types";

export function createTwinClassApi(settings: ApiSettings) {
  function search({
    pagination,
    search,
    filters,
  }: {
    pagination: PaginationState;
    search?: string;
    filters: TwinClassFilters;
  }) {
    return settings.client.POST("/private/twin_class/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinClassMode: "MANAGED",
          showTwinClassHead2TwinClassMode: "DETAILED",
          showTwinClassExtends2TwinClassMode: "DETAILED",
          showTwinClassMarker2DataListOptionMode: "DETAILED",
          showTwinClassTag2DataListOptionMode: "DETAILED",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwinClass2PermissionMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
        twinClassKeyLikeList: search
          ? ["%" + search + "%"]
          : filters.twinClassKeyLikeList,
      },
    });
  }

  function getByKey({
    key,
    query = {},
  }: {
    key: string;
    query: operations["twinClassViewByKeyV1"]["parameters"]["query"];
  }) {
    return settings.client.GET(`/private/twin_class_by_key/{twinClassKey}/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassKey: key },
        query: query,
      },
    });
  }

  function getById({
    id,
    query = {},
  }: {
    id: string;
    query: operations["twinClassViewV1"]["parameters"]["query"];
  }) {
    return settings.client.GET(`/private/twin_class/{twinClassId}/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassId: id },
        query: query,
      },
    });
  }

  function create({ body }: { body: TwinClassCreateRq }) {
    return settings.client.POST("/private/twin_class/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update({
    twinClassId,
    body,
  }: {
    twinClassId: string;
    body: TwinClassUpdateRq;
  }) {
    return settings.client.PUT("/private/twin_class/{twinClassId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassId },
      },
      body: body,
    });
  }

  function getValidHeads({
    twinClassId,
    query = {},
    filters,
  }: {
    twinClassId: string;
    query?: TwinClassValidHeadQuery;
    filters?: TwinClassValidHeadFilters;
  }) {
    return settings.client.POST(
      `/private/twin_class/{twinClassId}/valid_heads/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinClassId },
          query: query,
        },
        body: { ...filters },
      }
    );
  }

  const getLinks = async ({ twinClassId }: { twinClassId: string }) => {
    return settings.client.GET("/private/twin_class/{twinClassId}/link/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassId },
        query: {
          showLinkDst2TwinClassMode: "MANAGED",
          showLinkMode: "DETAILED",
        },
      },
    });
  };

  function getValidTwinsForLink({
    twinClassId,
    linkId,
    pagination,
    filters,
  }: {
    twinClassId: string;
    linkId: string;
    pagination: PaginationState;
    filters?: TwinSimpleFilters;
  }) {
    return settings.client.POST(
      "/private/twin_class/{twinClassId}/link/{linkId}/valid_twins/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinClassId, linkId },
          query: {
            showTwinMode: "DETAILED",
            showTwinClassMode: "DETAILED",
            offset: pagination.pageIndex * pagination.pageSize,
            limit: pagination.pageSize,
          },
        },
        body: filters ?? {},
      }
    );
  }

  function searchTags({
    twinClassId,
    pagination,
    filters,
  }: {
    twinClassId: string;
    pagination: PaginationState;
    filters: TagSearchFilters;
  }) {
    return settings.client.POST(
      "/private/twin_class/{twinClassId}/tag/search/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinClassId },
          query: {
            lazyRelation: false,
            //showDataListMode: "DETAILED",
            showDataListOptionMode: "DETAILED",
            offset: pagination.pageIndex * pagination.pageSize,
            limit: pagination.pageSize,
            sortAsc: false,
          },
        },
        body: { ...filters },
      }
    );
  }

  return {
    search,
    getByKey,
    getById,
    create,
    update,
    getValidHeads,
    getLinks,
    getValidTwinsForLink,
    searchTags,
  };
}

export type TwinClassApi = ReturnType<typeof createTwinClassApi>;
