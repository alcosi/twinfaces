import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { NotificationUpdateRq } from "../types";

export function useUpdateNotification() {
  const api = useContext(PrivateApiContext);

  async function updateNotification({ body }: { body: NotificationUpdateRq }) {
    const { error } = await api.recipient.updateHistoryNotification({
      body,
    });

    if (error) {
      throw new Error("Failed to update notification due to API error", error);
    }
  }

  return { updateNotification };
}
