import { PaginationState } from "@tanstack/table-core";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { operations } from "@/shared/api/generated/schema";

import {
  TwinCreateRq,
  TwinFilters,
  TwinSimpleFilters,
  TwinUpdateRq,
  TwinViewQuery,
} from "./types";

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
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: [{ ...filters }],
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
          showTwin2TwinClassMode: "DETAILED",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwinFieldCollectionMode: "ALL_FIELDS",
          showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
          showTwinClass2LinkMode: "DETAILED",
          showTwinField2UserMode: "DETAILED",
          showTwinClassMode: "DETAILED",
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
          // showTwin2TwinClassMode: "DETAILED",
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
    getById,
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

// lazyRelation?: boolean;
// showAttachment2TransitionMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showAttachment2UserMode?: "HIDE" | "SHORT" | "DETAILED";
// showFeaturerParamMode?: "HIDE" | "SHOW";
// showLinkDst2TwinClassMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwin2AttachmentCollectionMode?: "DIRECT" | "FROM_TRANSITIONS" | "FROM_COMMENTS" | "FROM_FIELDS" | "ALL";
// showTwin2AttachmentMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwin2StatusMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwin2TransitionMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwin2TwinClassMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwin2TwinLinkMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwin2UserMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinActionMode?: "HIDE" | "SHOW";
// showTwinAliasMode?: "HIDE" | "D" | "C" | "B" | "S" | "T" | "K" | "ALL";
// showTwinAttachmentActionMode?: "HIDE" | "SHOW";
// showTwinAttachmentCountMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinByHeadMode?: "WHITE" | "GREEN" | "FOREST_GREEN" | "YELLOW" | "BLUE" | "BLACK" | "GRAY" | "ORANGE" | "MAGENTA" | "PINK" | "LAVENDER";
// showTwinByLinkMode?: "WHITE" | "GREEN" | "FOREST_GREEN" | "YELLOW" | "BLUE" | "BLACK" | "GRAY" | "ORANGE" | "MAGENTA" | "PINK" | "LAVENDER";
// showTwinClass2FeaturerMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinClass2LinkMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwinClass2PermissionMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinClass2StatusMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinClass2TwinClassFieldMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwinClassExtends2TwinClassMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwinClassFieldDescriptor2DataListOptionMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinClassFieldDescriptor2TwinMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinClassFieldDescriptor2UserMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinClassHead2TwinClassMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwinClassMarker2DataListOptionMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinClassMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwinClassTag2DataListOptionMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinCreatableChild2TwinClassMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwinField2DataListOptionMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinField2TwinMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinField2UserMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinFieldCollectionMode?: "NO_FIELDS" | "NOT_EMPTY_FIELDS" | "ALL_FIELDS" | "NOT_EMPTY_FIELDS_WITH_ATTACHMENTS" | "ALL_FIELDS_WITH_ATTACHMENTS";
// showTwinLink2LinkMode?: "HIDE" | "SHORT" | "DETAILED" | "MANAGED";
// showTwinLink2UserMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinMarker2DataListOptionMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinMode?: "HIDE" | "SHORT" | "DETAILED";
// showTwinTag2DataListOptionMode?: "HIDE" | "SHORT" | "DETAILED";
