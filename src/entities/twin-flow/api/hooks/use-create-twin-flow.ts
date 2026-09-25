import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinFlowCreateRq } from "../types";

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
      const { data, error } = await api.twinFlow.create({
        twinClassId,
        body,
      });

      if (error) {
        throw error;
      }

      return data?.twinflow?.id;
    },
    [api]
  );

  return { createTwinFlow };
};
