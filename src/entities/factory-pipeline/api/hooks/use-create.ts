import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryPipelineCreate } from "../types";

export const useFactoryPipelineCreate = () => {
  const api = useContext(PrivateApiContext);

  const createFactoryPipeline = useCallback(
    async ({ body }: { body: FactoryPipelineCreate }) => {
      try {
        const { data, error } = await api.factoryPipeline.create({
          body: { factoryPipelines: [body] },
        });

        if (error) {
          throw new Error("Failed to create factory pipeline");
        }

        return data?.factoryPipelineList?.[0]?.id;
      } catch (error) {
        throw new Error("An error occured while creating factory pipeline");
      }
    },
    [api]
  );

  return { createFactoryPipeline };
};
