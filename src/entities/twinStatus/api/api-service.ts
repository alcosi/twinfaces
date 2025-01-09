import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { PaginationState } from "@tanstack/react-table";
import {
  TwinStatusCreateRq,
  TwinStatusFilters,
  TwinStatusUpdateRq,
} from "./types";

export function createTwinStatusApi(settings: ApiSettings) {
  function create({
    twinClassId,
    data,
  }: {
    twinClassId: string;
    data: TwinStatusCreateRq;
  }) {
    return settings.client.POST(
      "/private/twin_class/{twinClassId}/twin_status/v1",
      {
        params: {
          header: getApiDomainHeaders(settings),
          path: { twinClassId: twinClassId },
        },
        body: data,
      }
    );
  }

  function update({
    statusId,
    data,
  }: {
    statusId: string;
    data: TwinStatusUpdateRq;
  }) {
    return settings.client.PUT("/private/twin_status/{twinStatusId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinStatusId: statusId },
      },
      body: data,
    });
  }

  function getById({ twinStatusId }: { twinStatusId: string }) {
    return settings.client.GET(`/private/twin_status/{twinStatusId}/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinStatusId },
        query: {
          showStatusMode: "DETAILED",
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
          showStatusMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: true,
        },
      },
      body: { ...filters },
    });
  }

  return { create, update, getById, search };
}

export type TwinStatusApi = ReturnType<typeof createTwinStatusApi>;
