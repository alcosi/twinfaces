import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  TwinClassFieldCreateRq,
  TwinClassFieldSearchFilters,
  TwinClassFieldUpdateRq,
} from "./types";

export function createTwinClassFieldApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: TwinClassFieldSearchFilters;
  }) {
    return settings.client.POST("/private/twin_class_fields/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinClassFieldMode: "MANAGED",
          showTwinClassField2TwinClassMode: "DETAILED",
          showTwinClassField2PermissionMode: "DETAILED",
          showTwinClassField2FeaturerMode: "DETAILED",
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

  function searchBySearchId({
    searchId,
    narrow,
    params = {},
  }: {
    searchId: string;
    narrow: TwinClassFieldSearchFilters;
    params?: Record<string, string>;
  }) {
    return settings.client.POST(
      "/private/twin_class_fields/search/{searchId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showTwinClassFieldMode: "DETAILED",
            showTwinClassField2TwinClassMode: "DETAILED",
            showTwinClassField2PermissionMode: "DETAILED",
            showTwinClassField2FeaturerMode: "DETAILED",
            showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
          },
          path: { searchId },
        },
        body: {
          narrow,
          params,
        },
      }
    );
  }

  function getFields({ id }: { id: string }) {
    return settings.client.GET(
      `/private/twin_class/{twinClassId}/field/list/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            showTwinClassFieldMode: "MANAGED",
            showTwinClass2TwinClassFieldMode: "MANAGED",
            showTwinClassFieldCollectionMode: "SHOW",
          },
          path: { twinClassId: id },
        },
      }
    );
  }

  function getById({ fieldId }: { fieldId: string }) {
    return settings.client.GET(
      "/private/twin_class_field/{twinClassFieldId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinClassFieldId: fieldId },
          query: {
            lazyRelation: false,
            showTwinClassFieldMode: "MANAGED",
            showTwinClass2PermissionMode: "DETAILED",
            showTwinClassField2TwinClassMode: "DETAILED",
            showTwinClassField2FeaturerMode: "DETAILED",
            showTwinClassField2PermissionMode: "DETAILED",
          },
        },
      }
    );
  }

  function create({ id, body }: { id: string; body: TwinClassFieldCreateRq }) {
    return settings.client.POST(`/private/twin_class/{twinClassId}/field/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassId: id },
      },
      body: body,
    });
  }

  function update({
    fieldId,
    body,
  }: {
    fieldId: string;
    body: TwinClassFieldUpdateRq;
  }) {
    return settings.client.PUT(
      "/private/twin_class_field/{twinClassFieldId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinClassFieldId: fieldId },
        },
        body,
      }
    );
  }

  return {
    search,
    // getFields,
    getById,
    create,
    update,
    searchBySearchId,
  };
}

export type TwinClassFieldApi = ReturnType<typeof createTwinClassFieldApi>;
