import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { NotificationCreateRq } from "../types";

export const useNotificationCreate = () => {
  const api = useContext(PrivateApiContext);

  const createNotification = useCallback(
    async ({ body }: { body: NotificationCreateRq }) => {
      try {
        const { error } = await api.recipient.createHistoryNotification({
          body,
        });

        if (error) {
          throw new Error("Failed to create notification");
        }
      } catch {
        throw new Error("An error occured while creating notification");
      }
    },
    [api]
  );

  return { createNotification };
};
