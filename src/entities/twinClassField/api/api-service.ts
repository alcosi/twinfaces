import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import {
  TwinClassFieldCreateRq,
  TwinClassFieldUpdateRq,
  TwinClassFieldV2Filters,
} from "./types";
import { PaginationState } from "@tanstack/table-core";

export function createTwinClassFieldApi(settings: ApiSettings) {
  async function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: TwinClassFieldV2Filters;
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

  function getFields({ id }: { id: string }) {
    return settings.client.GET(
      `/private/twin_class/{twinClassId}/field/list/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            showTwinClassFieldMode: "MANAGED",
            showTwinClass2TwinClassFieldMode: "MANAGED",
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
            showLinkDst2TwinClassMode: "MANAGED",
            showTwin2StatusMode: "DETAILED",
            showTwin2TwinClassMode: "MANAGED",
            showTwin2UserMode: "DETAILED",
            showTwinAliasMode: "DETAILED",
            showTwinByHeadMode: "WHITE",
            showTwinClass2LinkMode: "DETAILED",
            showTwinClass2StatusMode: "DETAILED",
            showTwinClass2TwinClassFieldMode: "MANAGED",
            showTwinClassExtends2TwinClassMode: "MANAGED",
            showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
            showTwinClassFieldDescriptor2TwinMode: "DETAILED",
            showTwinClassFieldDescriptor2UserMode: "DETAILED",
            showTwinClassFieldMode: "MANAGED",
            showTwinClassHead2TwinClassMode: "MANAGED",
            showTwinClassMarker2DataListOptionMode: "DETAILED",
            showTwinClassMode: "MANAGED",
            showTwinClassTag2DataListOptionMode: "DETAILED",
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
    getFields,
    getById,
    create,
    update,
  };
}

export type TwinClassFieldApi = ReturnType<typeof createTwinClassFieldApi>;
