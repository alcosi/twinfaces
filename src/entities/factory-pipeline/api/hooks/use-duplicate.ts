import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryPipelineDuplicateRq } from "../types";

export const useFactoryPipelineDuplicate = () => {
  const api = useContext(PrivateApiContext);

  const duplicateFactoryPipeline = useCallback(
    async (body: FactoryPipelineDuplicateRq) => {
      try {
        const { data, error } = await api.factoryPipeline.duplicate({ body });

        if (error) {
          throw new Error("Failed to duplicate factory pipeline");
        }

        return data;
      } catch {
        throw new Error("An error occurred while duplicating factory pipeline");
      }
    },
    [api]
  );

  return { duplicateFactoryPipeline };
};
