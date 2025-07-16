import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryPipelineUpdateRq } from "../types";

export function useUpdateFactoryPipeline() {
  const api = useContext(PrivateApiContext);

  async function updateFactoryPipeline({
    factoryPipelineId,
    body,
  }: {
    factoryPipelineId: string;
    body: FactoryPipelineUpdateRq;
  }) {
    const { error } = await api.factoryPipeline.update({
      id: factoryPipelineId,
      body,
    });

    if (error) {
      throw new Error(
        "Failed to fetch factory pipeline due to API error",
        error
      );
    }
  }

  return { updateFactoryPipeline };
}
