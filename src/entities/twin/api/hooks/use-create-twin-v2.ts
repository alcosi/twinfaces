import { useCallback, useContext } from "react";

import { TwinCreateRq, TwinCreateRsV1 } from "@/entities/twin/server";
import { PrivateApiContext } from "@/shared/api";

export const useCreateTwin = () => {
  const api = useContext(PrivateApiContext);

  const createTwin = useCallback(
    async ({ body }: { body: TwinCreateRq }): Promise<TwinCreateRsV1> => {
      try {
        const { data, error } = await api.twin.create({ body });
        if (error) {
          throw new Error("Failed to create twin");
        }
        return data;
      } catch (error) {
        throw new Error("An error occurred while creating twin");
      }
    },
    [api]
  );

  return { createTwin };
};
