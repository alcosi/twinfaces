import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryDuplicateRq } from "../types";

export const useFactoryDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactory = useCallback(
    async (body: FactoryDuplicateRq) => {
      try {
        const { data, error } = await api.factory.duplicate({ body });

        if (error) {
          throw new Error("Failed to duplicate factory");
        }

        return data;
      } catch {
        throw new Error("An error occurred while duplicating factory");
      }
    },
    [api]
  );

  return { duplicateFactory };
};
