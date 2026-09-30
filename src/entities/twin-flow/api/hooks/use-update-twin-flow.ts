import { useCallback, useContext } from "react";

import { TwinFlowUpdate } from "@/entities/twin-flow";
import { PrivateApiContext } from "@/shared/api";

export const useUpdateTwinFlow = () => {
  const api = useContext(PrivateApiContext);

  const updateTwinFlow = useCallback(
    async ({
      twinflowId,
      body,
    }: {
      twinflowId: string;
      body: Omit<TwinFlowUpdate, "id">;
    }) => {
      return await api.twinFlow.update({
        body: { twinflows: [{ id: twinflowId, ...body }] },
      });
    },
    [api]
  );

  return { updateTwinFlow };
};
