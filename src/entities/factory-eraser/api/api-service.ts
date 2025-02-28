import { PaginationState } from "@tanstack/react-table";

import {
  FactoryEraserRqQuery,
  FactoryEraserSearchRq,
  FactoryEraserUpdate,
} from "@/entities/factory-eraser";
import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createFactoryEraserApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: FactoryEraserSearchRq;
  }) {
    return settings.client.POST("/private/factory_eraser/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showFactoryEraserMode: "DETAILED",
          showFactoryEraser2FactoryMode: "DETAILED",
          showFactoryEraser2TwinClassMode: "DETAILED",
          showFactoryEraser2FactoryConditionSetMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  function getById({
    eraserId,
    query,
  }: {
    eraserId: string;
    query: FactoryEraserRqQuery;
  }) {
    return settings.client.GET("/private/factory_eraser/{eraserId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { eraserId },
        query,
      },
    });
  }

  function update({
    factoryEraserId,
    body,
  }: {
    factoryEraserId: string;
    body: FactoryEraserUpdate;
  }) {
    return settings.client.PUT(
      "/private/factory/factory_eraser/{factoryEraserId}/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { factoryEraserId },
        },
        body: body,
      }
    );
  }

  return { search, getById, update };
}

export type FactoryEraserApi = ReturnType<typeof createFactoryEraserApi>;
