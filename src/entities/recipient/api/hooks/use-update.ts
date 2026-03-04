import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { RecipientUpdateRq } from "../types";

export const useRecipientUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateRecipient = useCallback(
    async ({ body }: { body: RecipientUpdateRq }) => {
      return await api.recipient.update({ body });
    },
    [api]
  );

  return { updateRecipient };
};
