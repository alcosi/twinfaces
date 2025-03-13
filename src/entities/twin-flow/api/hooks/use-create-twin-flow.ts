import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinFlowCreateRq } from "../types";

// TODO: Apply caching-strategy
export const useCreateTwinFlow = () => {
  const api = useContext(PrivateApiContext);

  const createTwinFlow = useCallback(
    async ({
      twinClassId,
      body,
    }: {
      twinClassId: string;
      body: TwinFlowCreateRq;
    }) => {
      const { error } = await api.twinFlow.create({ twinClassId, body });

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createTwinFlow };
};
