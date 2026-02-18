import { useCallback, useContext } from "react";

import { RecipientCreateRq } from "@/entities/recipient";
import { PrivateApiContext } from "@/shared/api";

export const useRecipientCreate = () => {
  const api = useContext(PrivateApiContext);

  const createRecipient = useCallback(
    async ({ body }: { body: RecipientCreateRq }) => {
      try {
        const { error } = await api.recipient.create({ body });

        if (error) {
          throw new Error("Failed to create recipient");
        }
      } catch (error) {
        console.error("Failed to create recipient:", error);
        throw new Error("An error occured while creating recipient");
      }
    },
    [api]
  );

  return { createRecipient };
};
