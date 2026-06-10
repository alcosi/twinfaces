import { PaginationState } from "@tanstack/table-core";

import {
  TwinCreateRq,
  TwinFilters,
  TwinFiltersBySearchId,
  TwinSimpleFilters,
  TwinUpdateRq,
} from "@/entities/twin/server";
import {
  ApiSettings,
  HttpPostSpec,
  SortV1,
  getApiDomainHeaders,
} from "@/shared/api";

export function createTwinApi(settings: ApiSettings) {
  // Multi-field sorting on v4 is expressed via TwinClassFieldId, so the
  // single active sort (if any) is forwarded as a one-element `sorts` array.
  function search({
    pagination,
    filters,
    sort,
  }: {
    pagination: PaginationState;
    filters?: TwinFilters;
    sort?: SortV1;
  }) {
    return settings.client.POST("/private/twin/search/v4", {
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
          showTwinFieldCollectionMode: "SHOW",
          showTwinFieldCollectionFilterEmptyMode: "ANY",
          showTwin2TransitionMode: "DETAILED",
          showTwinByLinkMode: "GREEN",
          showTwin2TwinLinkMode: "SHORT",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          showTwinField2DataListOptionMode: "DETAILED",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwinClassFieldCollectionMode: "SHOW",
          showAttachment2TwinMode: "DETAILED",
          showTwin2AttachmentMode: "DETAILED",
          showTwin2AttachmentCollectionMode: "FROM_FIELDS",
        },
      },
      body: {
        search: { ...filters },
        sorts: sort?.field
          ? [
              {
                twinClassFieldId: sort.field,
                direction: sort.direction ?? "ASC",
              },
            ]
          : undefined,
      },
    });
  }

  // Server-side aggregation backing the pie-chart view. `groupFields` are
  // TwinClassFieldId UUIDs (static or dynamic fields); the response groups
  // come back with the matching static projection populated.
  function count({
    filters,
    groupFields,
    offset,
    limit,
    sortAsc,
  }: {
    filters?: TwinFilters;
    groupFields: string[];
    offset?: number;
    limit?: number;
    sortAsc?: boolean;
  }) {
    return settings.client.POST("/private/twin/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinMode: "SHORT",
          showTwinClassMode: "SHORT",
          showTwin2TwinClassMode: "DETAILED",
          showTwin2UserMode: "DETAILED",
          showTwin2StatusMode: "DETAILED",
          showTwinByHeadMode: "YELLOW",
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

  function searchBySearchId({
    path,
    query,
    body,
  }: HttpPostSpec<TwinFiltersBySearchId>) {
    return settings.client.POST("/private/twin/search/{searchId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          ...query,
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
          showTwinFieldCollectionMode: "SHOW",
          showTwinFieldCollectionFilterEmptyMode: "ANY",
          showTwin2TransitionMode: "DETAILED",
          showTwinByLinkMode: "GREEN",
          showTwin2TwinLinkMode: "SHORT",
          sortAsc: false,
          showTwinField2DataListOptionMode: "DETAILED",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwinClassFieldCollectionMode: "SHOW",
          showAttachment2TwinMode: "DETAILED",
          showTwin2AttachmentMode: "DETAILED",
          showTwin2AttachmentCollectionMode: "FROM_FIELDS",
        },
        path,
      },
      body,
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
          showTwinClassFieldCollectionMode: "SHOW",
          showTwinFieldCollectionMode: "SHOW",
          showTwinFieldCollectionFilterEmptyMode: "ANY",
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
    count,
    searchBySearchId,
    create,
    update,
    getFieldsById,
    getLinks,
    upsertField,
    getValidTwinsForLink,
  };
}

export type TwinApi = ReturnType<typeof createTwinApi>;
