import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateNotificationsFromMap } from "../../libs";
import { HistoryNotificationFilters, Notification_DETAILED } from "../types";

export function useHistoryNotificationSearch() {
  const api = useContext(PrivateApiContext);

  const searchHistoryNotification = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: HistoryNotificationFilters;
    }): Promise<PagedResponse<Notification_DETAILED>> => {
      try {
        const { data, error } =
          await api.notification.searchHistoryNotification({
            pagination,
            filters,
          });

        if (error) {
          throw new Error(
            "Failed to fetch history notifications due to API error"
          );
        }

        const notifications = data.historyNotifications?.map((dto) =>
          hydrateNotificationsFromMap(dto, data.relatedObjects)
        );

        return {
          data: notifications ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error(
          "An error occured while fetching history notifications"
        );
      }
    },
    [api]
  );

  return { searchHistoryNotification };
}
