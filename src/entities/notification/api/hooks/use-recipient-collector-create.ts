import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { RecipientCollectorCreateRq } from "../types";

export const useRecipientCollectorCreate = () => {
  const api = useContext(PrivateApiContext);

  const createRecipientCollector = useCallback(
    async ({ body }: { body: RecipientCollectorCreateRq }) => {
      try {
        const { error } = await api.notification.createRecipientCollector({
          body,
        });

        if (error) {
          throw new Error("Failed to create recipient collector");
        }
      } catch (error) {
        console.error("Failed to create recipient collector:", error);
        throw new Error("An error occured while creating recipient collector");
      }
    },
    [api]
  );

  return { createRecipientCollector };
};
