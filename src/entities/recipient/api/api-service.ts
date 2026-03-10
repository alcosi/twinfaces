import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { NotificationFilters, RecipientFilters } from "./types";

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

  function searchHistoryNotification({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: NotificationFilters;
  }) {
    return settings.client.POST(`/private/history_notification/search/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showHistoryNotificationMode: "DETAILED",
          showHistoryNotification2TwinClassMode: "DETAILED",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwinClassFieldCollectionMode: "SHOW",
          showHistoryNotification2TwinValidatorSetMode: "DETAILED",
          showHistoryNotification2NotificationSchemaMode: "DETAILED",
          showHistoryNotification2HistoryNotificationRecipientMode: "DETAILED",
          showHistoryNotification2NotificationChannelEventMode: "DETAILED",
          showNotificationChannelEvent2NotificationContextMode: "DETAILED",
          showNotificationChannelEvent2NotificationChannelMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
      body: {
        ...filters,
      },
    });
  }

  return { search, searchHistoryNotification };
}

export type RecipientApi = ReturnType<typeof createRecipientApi>;
