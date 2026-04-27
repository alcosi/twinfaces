import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinTriggerUpdateRq } from "../types";

export function useTwinTriggerUpdate() {
  const api = useContext(PrivateApiContext);

  const updateTwinTrigger = useCallback(
    async ({ body }: { body: TwinTriggerUpdateRq }) => {
      const { error } = await api.twinTrigger.update({ body });

      if (error) {
        throw new Error("Failed to update twin trigger due to API error");
      }
    },
    [api]
  );

  return { updateTwinTrigger };
}
