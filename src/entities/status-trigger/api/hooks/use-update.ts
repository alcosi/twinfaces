import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { StatusTriggerUpdateRq } from "../types";

export function useStatusTriggerUpdate() {
  const api = useContext(PrivateApiContext);

  const updateStatusTrigger = useCallback(
    async ({ body }: { body: StatusTriggerUpdateRq }) => {
      const { error } = await api.statusTrigger.update({ body });

      if (error) {
        throw new Error("Failed to update status trigger due to API error");
      }
    },
    [api]
  );

  return { updateStatusTrigger };
}
