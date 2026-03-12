import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateHistoryNotificationRecipientCollectorFromMap } from "../../libs/helpers";
import {
  HistoryNotificationRecipientCollector_DETAILED,
  HistoryNotificationRecipientCollectorsFilters,
} from "../types";

export function useHistoryNotificationRecipientCollectorSearch() {
  const api = useContext(PrivateApiContext);

  const searchHistoryNotificationRecipientCollector = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: HistoryNotificationRecipientCollectorsFilters;
    }): Promise<
      PagedResponse<HistoryNotificationRecipientCollector_DETAILED>
    > => {
      try {
        const { data, error } =
          await api.recipient.searchHistoryNotificationRecipientCollector({
            pagination,
            filters,
          });

        if (error) {
          throw new Error(
            "Failed to fetch history notifications recipient collectors due to API error"
          );
        }

        const historyNotificationRecipientCollectors =
          data.recipientCollectors?.map((dto) =>
            hydrateHistoryNotificationRecipientCollectorFromMap(
              dto,
              data.relatedObjects
            )
          );

        return {
          data: historyNotificationRecipientCollectors ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error(
          "An error occured while fetching history notification recipient collectors"
        );
      }
    },
    [api]
  );

  return { searchHistoryNotificationRecipientCollector };
}
