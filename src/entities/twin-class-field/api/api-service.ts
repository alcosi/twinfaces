import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  TwinClassFieldCountGroupField,
  TwinClassFieldCreateRq,
  TwinClassFieldDuplicateRq,
  TwinClassFieldSearchFilters,
  TwinClassFieldSortField,
  TwinClassFieldUpdateRq,
} from "./types";

export function createTwinClassFieldApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
    sortField,
    sortDirection,
  }: {
    pagination: PaginationState;
    filters: TwinClassFieldSearchFilters;
    sortField?: TwinClassFieldSortField;
    sortDirection?: "ASC" | "DESC";
  }) {
    return settings.client.POST("/private/twin_class_fields/search/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinClassFieldMode: "MANAGED", //! DETAILED only for dev, prod MANAGED ?
          showTwinClassField2TwinClassMode: "DETAILED",
          showTwinClassField2PermissionMode: "DETAILED",
          showTwinClassField2FeaturerMode: "DETAILED",
          showFeaturerParamMode: "SHOW",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      },
      body: {
        search: filters,
        sortField,
        sortDirection,
      },
    });
  }

  function count({
    filters,
    groupFields,
  }: {
    filters: TwinClassFieldSearchFilters;
    groupFields: TwinClassFieldCountGroupField[];
  }) {
    return settings.client.POST("/private/twin_class_fields/count/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinClassFieldMode: "DETAILED",
          showTwinClassField2TwinClassMode: "DETAILED",
          showTwinClassField2PermissionMode: "DETAILED",
          showTwinClassField2FeaturerMode: "DETAILED",
        },
      },
      body: {
        search: filters,
        groupFields,
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

  // function getFields({ id }: { id: string }) {
  //   return settings.client.GET(
  //     `/private/twin_class/{twinClassId}/field/list/v1`,
  //     {
  //       params: {
  //         header: getApiDomainHeaders(settings),
  //         query: {
  //           showTwinClassFieldMode: "MANAGED",
  //           showTwinClass2TwinClassFieldMode: "MANAGED",
  //           showTwinClassFieldCollectionMode: "SHOW",
  //         },
  //         path: { twinClassId: id },
  //       },
  //     }
  //   );
  // }

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
            showFeaturerParamMode: "SHOW",
          },
        },
      }
    );
  }

  function create({ body }: { body: TwinClassFieldCreateRq }) {
    return settings.client.POST(`/private/twin_class_field/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function update({ body }: { body: TwinClassFieldUpdateRq }) {
    return settings.client.PUT("/private/twin_class_field/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function duplicate({ body }: { body: TwinClassFieldDuplicateRq }) {
    return settings.client.POST("/private/twin_class_field/duplicate/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  return {
    search,
    count,
    // getFields,
    getById,
    create,
    update,
    searchBySearchId,
    duplicate,
  };
}

export type TwinClassFieldApi = ReturnType<typeof createTwinClassFieldApi>;
