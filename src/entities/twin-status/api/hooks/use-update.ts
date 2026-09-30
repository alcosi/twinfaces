import { useCallback, useContext } from "react";

import { TwinStatusUpdate } from "@/entities/twin-status";
import { PrivateApiContext } from "@/shared/api";

export const useStatusUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateStatus = useCallback(
    async ({
      statusId,
      body,
    }: {
      statusId: string;
      body: Omit<TwinStatusUpdate, "id">;
    }) => {
      return await api.twinStatus.update({
        body: { statuses: [{ id: statusId, ...body }] },
      });
    },
    [api]
  );

  return { updateStatus };
};
