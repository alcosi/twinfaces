import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateNotificationsFromMap } from "../../libs";
import { Notification_DETAILED } from "../types";

export function useFetchNotificationById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchNotificationById = useCallback(
    async (id: string): Promise<Notification_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.recipient.searchHistoryNotification({
          pagination: {
            pageIndex: 0,
            pageSize: 1,
          },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw error;
        }

        if (
          isUndefined(data.historyNotifications) ||
          isEmptyArray(data.historyNotifications)
        ) {
          throw new Error(`Notification with ID ${id} not found.`);
        }

        return hydrateNotificationsFromMap(
          data.historyNotifications[0]!,
          data.relatedObjects
        );
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchNotificationById, isLoading };
}
