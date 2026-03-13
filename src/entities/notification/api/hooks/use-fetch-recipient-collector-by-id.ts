import { useCallback, useContext, useState } from "react";

import { hydrateHistoryNotificationRecipientCollectorFromMap } from "@/entities/notification";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { RecipientCollector_DETAILED } from "../types";

export const useRecipientCollectorFetchById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRecipientCollectorById = useCallback(
    async (id: string): Promise<RecipientCollector_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.notification.searchRecipientCollector(
          {
            pagination: { pageIndex: 0, pageSize: 1 },
            filters: {
              idList: [id],
            },
          }
        );

        if (error) {
          throw new Error("Failed to fetch recipient due to API error");
        }

        const recipientCollectors = data.recipientCollectors ?? [];
        if (isUndefined(recipientCollectors[0])) {
          throw new Error("Invalid response data while fetching recipient");
        }

        const recipientCollector =
          hydrateHistoryNotificationRecipientCollectorFromMap(
            recipientCollectors[0],
            data.relatedObjects
          );

        return recipientCollector;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchRecipientCollectorById, loading };
};
