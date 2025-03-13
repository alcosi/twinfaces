import { useCallback, useContext } from "react";

import { TwinFlowUpdateRq } from "@/entities/twin-flow";
import { PrivateApiContext } from "@/shared/api";

// TODO: Apply caching-strategy
export const useUpdateTwinFlow = () => {
  const api = useContext(PrivateApiContext);

  const updateTwinFlow = useCallback(
    async ({
      twinflowId,
      body,
    }: {
      twinflowId: string;
      body: TwinFlowUpdateRq;
    }) => {
      return await api.twinFlow.update({ twinflowId, body });
    },
    [api]
  );

  return { updateTwinFlow };
};
