import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryCreateRq } from "../types";

export const useCreateFactory = () => {
  const api = useContext(PrivateApiContext);

  const createFactory = useCallback(
    async (body: FactoryCreateRq) => {
      try {
        const { data, error } = await api.factory.create({ body });

        if (error) {
          throw new Error("Failed to create factory");
        }

        return data?.factory?.id;
      } catch (error) {
        throw new Error("An error occured while creating factory");
      }
    },
    [api]
  );

  return { createFactory };
};
