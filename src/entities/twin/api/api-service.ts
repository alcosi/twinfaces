import { PaginationState } from "@tanstack/table-core";

import {
  TwinCreateRq,
  TwinFilters,
  TwinFiltersBySearchId,
  TwinSimpleFilters,
  TwinUpdateRq,
  TwinViewQuery,
} from "@/entities/twin/server";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createTwinApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: TwinFilters;
  }) {
    return settings.client.POST("/private/twin/search/v3", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          showTwin2TwinClassMode: "DETAILED",
          showTwin2UserMode: "DETAILED",
          showTwin2StatusMode: "DETAILED",
          showTwinMarker2DataListOptionMode: "DETAILED",
          showTwinTag2DataListOptionMode: "DETAILED",
          showTwinByHeadMode: "YELLOW",
          showTwinAliasMode: "C",
          showTwinFieldCollectionMode: "ALL_FIELDS",
          showTwin2TransitionMode: "DETAILED",
          showTwinByLinkMode: "GREEN",
          showTwin2TwinLinkMode: "SHORT",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
          showTwinField2DataListOptionMode: "DETAILED",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showAttachment2TwinMode: "DETAILED",
          showTwin2AttachmentMode: "DETAILED",
          showTwin2AttachmentCollectionMode: "FROM_FIELDS",
        },
      },
      body: [{ ...filters }],
    });
  }

  function searchBySearchId({
    searchId,
    searchParams,
    pagination,
    filters,
  }: {
    searchId: string;
    searchParams: Record<string, string>;
    pagination: PaginationState;
    filters?: TwinFiltersBySearchId;
  }) {
    return settings.client.POST("/private/twin/search/{searchId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          showTwin2TwinClassMode: "DETAILED",
          showTwin2UserMode: "DETAILED",
          showTwin2StatusMode: "DETAILED",
          showTwinMarker2DataListOptionMode: "DETAILED",
          showTwinTag2DataListOptionMode: "DETAILED",
          showTwinByHeadMode: "YELLOW",
          showTwinAliasMode: "C",
          showTwinFieldCollectionMode: "ALL_FIELDS",
          showTwin2TransitionMode: "DETAILED",
          showTwinByLinkMode: "GREEN",
          showTwin2TwinLinkMode: "SHORT",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
          showTwinField2DataListOptionMode: "DETAILED",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showAttachment2TwinMode: "DETAILED",
          showTwin2AttachmentMode: "DETAILED",
          showTwin2AttachmentCollectionMode: "FROM_FIELDS",
        },
        path: { searchId },
      },
      body: {
        narrow: { ...filters },
        params: { ...searchParams },
      },
    });
  }

  function getById({ id, query = {} }: { id: string; query?: TwinViewQuery }) {
    return settings.client.GET("/private/twin/{twinId}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: id },
        query: query,
      },
    });
  }

  function create({ body }: { body: TwinCreateRq }) {
    return settings.client.POST("/private/twin/v2", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update({ id, body }: { id: string; body: TwinUpdateRq }) {
    return settings.client.PUT("/private/twin/{twinId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: id },
      },
      body: body,
    });
  }

  function getFieldsById({ twinId }: { twinId: string }) {
    return settings.client.GET("/private/twin/{twinId}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: twinId },
        query: {
          lazyRelation: false,
          showTwinMode: "DETAILED",
          showTwin2TwinClassMode: "DETAILED",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwinFieldCollectionMode: "ALL_FIELDS",
          showTwinField2DataListOptionMode: "DETAILED",
          showTwinClass2LinkMode: "DETAILED",
          showTwinField2UserMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          showTwin2UserMode: "DETAILED",
          showTwinByLinkMode: "GREEN",
          showTwin2TwinLinkMode: "SHORT",
        },
      },
    });
  }

  function getHistory({
    twinId,
    pagination,
  }: {
    twinId: string;
    pagination: PaginationState;
  }) {
    return settings.client.GET("/private/twin/{twinId}/history/list/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId },
        query: {
          showHistory2TwinMode: "DETAILED",
          showTwin2UserMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
    });
  }

  function getLinks({ twinId }: { twinId: string }) {
    return settings.client.GET("/private/twin/{twinId}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: twinId },
        query: {
          showTwin2TwinLinkMode: "DETAILED",
          showTwinLink2UserMode: "DETAILED",
          showTwinLink2LinkMode: "DETAILED",
          showTwinField2TwinMode: "DETAILED",
          showTwinByLinkMode: "GREEN",
        },
      },
    });
  }

  function upsertField({
    twinId,
    fieldKey,
    fieldValue,
  }: {
    twinId: string;
    fieldKey: string;
    fieldValue: string;
  }) {
    return settings.client.POST("/private/twin/{twinId}/field/{fieldKey}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId, fieldKey },
        query: {
          fieldValue,
        },
      },
    });
  }

  function getValidTwinsForLink({
    twinId,
    linkId,
    pagination,
    filters,
  }: {
    twinId: string;
    linkId: string;
    pagination: PaginationState;
    filters?: TwinSimpleFilters;
  }) {
    return settings.client.POST(
      "/private/twin/{twinId}/link/{linkId}/valid_twins/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinId, linkId },
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

  return {
    search,
    searchBySearchId,
    // getById,
    create,
    update,
    getFieldsById,
    getHistory,
    getLinks,
    upsertField,
    getValidTwinsForLink,
  };
}

export type TwinApi = ReturnType<typeof createTwinApi>;
