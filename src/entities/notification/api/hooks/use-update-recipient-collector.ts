import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { RecipientCollectorUpdateRq } from "../types";

export const useRecipientCollectorUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateRecipientCollector = useCallback(
    async ({ body }: { body: RecipientCollectorUpdateRq }) => {
      return await api.notification.updateRecipientCollector({ body });
    },
    [api]
  );

  return { updateRecipientCollector };
};
