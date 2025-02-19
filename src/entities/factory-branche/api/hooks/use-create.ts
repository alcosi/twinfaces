import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { FactoryBrancheCreateRq } from "../types";

export const useFactoryBrancheCreate = () => {
  const api = useContext(ApiContext);

  const createFactoryBranche = useCallback(
    async ({ id, body }: { id: string; body: FactoryBrancheCreateRq }) => {
      try {
        const { error } = await api.factoryBranche.create({ id, body });

        if (error) {
          throw new Error("Failed to create factory branche");
        }
      } catch (error) {
        throw new Error("An error occurred while creating factory branche");
      }
    },
    [api]
  );

  return { createFactoryBranche };
};
