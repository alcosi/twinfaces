import { useCallback, useContext } from "react";

import { TwinClassUpdateRq } from "@/entities/twin-class";
import { PrivateApiContext } from "@/shared/api";

// TODO: Apply caching-strategy
export const useUpdateTwinClass = () => {
  const api = useContext(PrivateApiContext);

  const updateTwinClass = useCallback(
    async ({
      twinClassId,
      body,
    }: {
      twinClassId: string;
      body: TwinClassUpdateRq;
    }) => {
      return await api.twinClass.update({ twinClassId, body });
    },
    [api]
  );

  return { updateTwinClass };
};
