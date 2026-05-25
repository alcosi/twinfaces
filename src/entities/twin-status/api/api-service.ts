import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  TwinStatusCreateRq,
  TwinStatusDuplicateRq,
  TwinStatusExportSqlRq,
  TwinStatusFilters,
  TwinStatusUpdateRq,
} from "./types";

export function createTwinStatusApi(settings: ApiSettings) {
  function create({
    twinClassId,
    body,
  }: {
    twinClassId: string;
    body: TwinStatusCreateRq;
  }) {
    return settings.client.POST(
      "/private/twin_class/{twinClassId}/twin_status/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinClassId: twinClassId },
        },
        body,
      }
    );
  }

  function update({
    statusId,
    body,
  }: {
    statusId: string;
    body: TwinStatusUpdateRq;
  }) {
    return settings.client.PUT("/private/twin_status/{twinStatusId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinStatusId: statusId },
      },
      body,
    });
  }

  function getById({ twinStatusId }: { twinStatusId: string }) {
    return settings.client.GET(`/private/twin_status/{twinStatusId}/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinStatusId },
        query: {
          lazyRelation: false,
          showStatusMode: "DETAILED",
          showTwinStatus2TwinClassMode: "DETAILED",
        },
      },
    });
  }

  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters?: TwinStatusFilters;
  }) {
    return settings.client.POST("/private/twin_status/search/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showStatusMode: "DETAILED",
          showTwinStatus2TwinClassMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: true,
        },
      },
      body: { ...filters },
    });
  }

  function duplicate({ body }: { body: TwinStatusDuplicateRq }) {
    return settings.client.POST("/private/twin_status/duplicate/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function exportSql({ body }: { body: TwinStatusExportSqlRq }) {
    return settings.client.POST("/private/twin_status/export/sql/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
      parseAs: "text",
    });
  }

  return { create, update, getById, search, duplicate, exportSql };
}

export type TwinStatusApi = ReturnType<typeof createTwinStatusApi>;
