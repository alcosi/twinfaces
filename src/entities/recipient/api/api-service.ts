import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  RecipientCreateRq,
  RecipientFilters,
  RecipientUpdateRq,
} from "./types";

export function createRecipientApi(settings: ApiSettings) {
  function search({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: RecipientFilters;
  }) {
    return settings.client.POST(
      `/private/history_notification_recipient/search/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showHistoryNotificationRecipientMode: "DETAILED",
            limit: pagination.pageSize,
            offset: pagination.pageIndex * pagination.pageSize,
          },
        },
        body: {
          search: {
            ...filters,
          },
        },
      }
    );
  }

  function create({ body }: { body: RecipientCreateRq }) {
    return settings.client.POST("/private/history_notification_recipient/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showHistoryNotificationRecipientMode: "DETAILED",
        },
      },
      body,
    });
  }

  function update({ body }: { body: RecipientUpdateRq }) {
    return settings.client.PUT("/private/history_notification_recipient/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showHistoryNotificationRecipientMode: "DETAILED",
        },
      },
      body,
    });
  }

  return { search, create, update };
}

export type RecipientApi = ReturnType<typeof createRecipientApi>;
