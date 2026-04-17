import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinTriggerCreateRq } from "../types";

export const useTwinTriggerCreate = () => {
  const api = useContext(PrivateApiContext);

  const createTwinTrigger = useCallback(
    async ({ body }: { body: TwinTriggerCreateRq }) => {
      try {
        const { error } = await api.twinTrigger.create({ body });

        if (error) {
          throw new Error("Failed to create twin trigger");
        }
      } catch {
        throw new Error("An error occured while creating twin trigger");
      }
    },
    [api]
  );

  return { createTwinTrigger };
};
