import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { NotificationSchema, NotificationSchemaFilters } from "../types";

export function useNotificationSchemaSearch() {
  const api = useContext(PrivateApiContext);

  const searchNotificationSchema = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: NotificationSchemaFilters;
    }): Promise<PagedResponse<NotificationSchema>> => {
      try {
        const { data, error } = await api.notification.searchNotificationSchema(
          {
            pagination,
            filters,
          }
        );

        if (error) {
          throw new Error("Failed to fetch recipients due to API error");
        }

        return {
          data: data.notificationSchemas ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error("An error occured while fetching recipients");
      }
    },
    [api]
  );

  return { searchNotificationSchema };
}
