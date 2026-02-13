import { PaginationState } from "@tanstack/react-table";

import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

import { RecipientFilters } from "./types";

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

  return { search };
}

export type RecipientApi = ReturnType<typeof createRecipientApi>;
