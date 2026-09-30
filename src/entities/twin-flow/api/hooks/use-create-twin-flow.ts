import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinFlowCreate } from "../types";

export const useCreateTwinFlow = () => {
  const api = useContext(PrivateApiContext);

  const createTwinFlow = useCallback(
    async ({ body }: { body: TwinFlowCreate }) => {
      const { data, error } = await api.twinFlow.create({
        body: { twinflows: [body] },
      });

      if (error) {
        throw error;
      }

      return data?.twinflowList?.[0]?.id;
    },
    [api]
  );

  return { createTwinFlow };
};
