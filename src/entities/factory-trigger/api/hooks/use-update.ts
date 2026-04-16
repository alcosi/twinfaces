import { useCallback, useContext } from "react";

import { FactoryTriggerUpdateRq } from "@/entities/factory-trigger";
import { PrivateApiContext } from "@/shared/api";

export const useFactoryTriggerUpdate = () => {
  const api = useContext(PrivateApiContext);
  const updateFactoryTrigger = useCallback(
    async ({ body }: { body: FactoryTriggerUpdateRq }) => {
      const { error } = await api.factoryTrigger.update({ body });
      if (error) {
        throw new Error("Failed to update factory trigger");
      }
    },
    [api]
  );

  return { updateFactoryTrigger };
};
