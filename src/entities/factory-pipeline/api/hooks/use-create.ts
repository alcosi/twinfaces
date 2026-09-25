import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryPipelineCreateRq } from "../types";

export const useFactoryPipelineCreate = () => {
  const api = useContext(PrivateApiContext);

  const createFactoryPipeline = useCallback(
    async ({ id, body }: { id: string; body: FactoryPipelineCreateRq }) => {
      try {
        const { data, error } = await api.factoryPipeline.create({ id, body });

        if (error) {
          throw new Error("Failed to create factory pipeline");
        }

        return data?.factoryPipeline?.id;
      } catch (error) {
        throw new Error("An error occured while creating factory pipeline");
      }
    },
    [api]
  );

  return { createFactoryPipeline };
};
