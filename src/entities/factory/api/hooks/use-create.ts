import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryCreate } from "../types";

export const useCreateFactory = () => {
  const api = useContext(PrivateApiContext);

  const createFactory = useCallback(
    async (body: FactoryCreate) => {
      try {
        const { data, error } = await api.factory.create({
          body: { factories: [body] },
        });

        if (error) {
          throw new Error("Failed to create factory");
        }

        return data?.factoryList?.[0]?.id;
      } catch (error) {
        throw new Error("An error occured while creating factory");
      }
    },
    [api]
  );

  return { createFactory };
};
