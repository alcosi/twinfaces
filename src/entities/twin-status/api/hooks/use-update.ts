import { useCallback, useContext } from "react";

import { TwinStatusUpdateRq } from "@/entities/twin-status";
import { PrivateApiContext } from "@/shared/api";

export const useStatusUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateStatus = useCallback(
    async ({
      statusId,
      body,
    }: {
      statusId: string;
      body: TwinStatusUpdateRq;
    }) => {
      return await api.twinStatus.update({ statusId, body });
    },
    [api]
  );

  return { updateStatus };
};
