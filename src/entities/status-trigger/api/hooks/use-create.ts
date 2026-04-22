import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { StatusTriggerCreateRq } from "../types";

export function useStatusTriggerCreate() {
  const api = useContext(PrivateApiContext);

  const createStatusTrigger = useCallback(
    async ({ body }: { body: StatusTriggerCreateRq }) => {
      try {
        const { error } = await api.statusTrigger.create({ body });

        if (error) {
          throw new Error("Failed to create status trigger");
        }
      } catch {
        throw new Error("An error occured while creating status trigger");
      }
    },
    [api]
  );

  return { createStatusTrigger };
}
