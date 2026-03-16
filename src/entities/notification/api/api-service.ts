import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import {
  HistoryNotificationFilters,
  NotificationCreateRq,
  NotificationUpdateRq,
  RecipientCollectorCreateRq,
  RecipientCollectorUpdateRq,
  RecipientCollectorsFilters,
  RecipientCreateRq,
  RecipientFilters,
  RecipientUpdateRq,
} from "./types";

export function createNotificationApi(settings: ApiSettings) {
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
            showHistoryNotificationRecipient2UserMode: "DETAILED",
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

  function searchHistoryNotification({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: HistoryNotificationFilters;
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

  function searchRecipientCollector({
    pagination,
    filters,
  }: {
    pagination: PaginationState;
    filters: RecipientCollectorsFilters;
  }) {
    return settings.client.POST(
      `/private/history_notification_recipient_collector/search/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
          query: {
            lazyRelation: false,
            showFeaturerParamMode: "SHOW",
            showHistoryNotificationRecipientCollector2FeaturerMode: "DETAILED",
            showHistoryNotificationRecipientCollector2HistoryNotificationRecipientMode:
              "DETAILED",
            showHistoryNotificationRecipientCollectorMode: "DETAILED",
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

  function updateHistoryNotification({ body }: { body: NotificationUpdateRq }) {
    return settings.client.PUT(`/private/history_notification/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function createHistoryNotification({ body }: { body: NotificationCreateRq }) {
    return settings.client.POST(`/private/history_notification/v1`, {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

  function updateRecipientCollector({
    body,
  }: {
    body: RecipientCollectorUpdateRq;
  }) {
    return settings.client.PUT(
      `/private/history_notification_recipient_collector/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
        },
        body,
      }
    );
  }

  function createRecipientCollector({
    body,
  }: {
    body: RecipientCollectorCreateRq;
  }) {
    return settings.client.POST(
      `/private/history_notification_recipient_collector/v1`,
      {
        params: {
          header: getApiDomainHeaders(settings),
        },
        body,
      }
    );
  }

  return {
    search,
    create,
    update,
    searchHistoryNotification,
    updateHistoryNotification,
    searchRecipientCollector,
    createHistoryNotification,
    updateRecipientCollector,
    createRecipientCollector,
  };
}

export type NotificationApi = ReturnType<typeof createNotificationApi>;
