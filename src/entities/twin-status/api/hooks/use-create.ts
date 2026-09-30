import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinStatusCreate } from "../types";

export const useStatusCreate = () => {
  const api = useContext(PrivateApiContext);

  const createStatus = useCallback(
    async ({ body }: { body: TwinStatusCreate }) => {
      const { data, error } = await api.twinStatus.create({
        body: { statuses: [body] },
      });

      if (error) {
        throw error;
      }

      return data?.statuses?.[0]?.id;
    },
    [api]
  );

  return { createStatus };
};
