import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryEraserDuplicateRq } from "../types";

export const useFactoryEraserDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactoryEraser = useCallback(
    async (body: FactoryEraserDuplicateRq) => {
      try {
        const { data, error } = await api.factoryEraser.duplicate({ body });

        if (error) {
          throw new Error("Failed to duplicate factory eraser");
        }

        return data;
      } catch {
        throw new Error("An error occurred while duplicating factory eraser");
      }
    },
    [api]
  );

  return { duplicateFactoryEraser };
};
