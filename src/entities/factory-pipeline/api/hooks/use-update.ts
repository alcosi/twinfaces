import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryPipelineUpdate } from "../types";

export function useUpdateFactoryPipeline() {
  const api = useContext(PrivateApiContext);

  async function updateFactoryPipeline({
    factoryPipelineId,
    body,
  }: {
    factoryPipelineId: string;
    body: Omit<FactoryPipelineUpdate, "id">;
  }) {
    const { error } = await api.factoryPipeline.update({
      body: { factoryPipelines: [{ id: factoryPipelineId, ...body }] },
    });

    if (error) {
      throw new Error("Failed to update factory pipeline due to API error");
    }
  }

  return { updateFactoryPipeline };
}
