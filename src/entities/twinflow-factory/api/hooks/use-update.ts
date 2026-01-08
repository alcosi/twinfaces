import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinFlowFactoryUpdateRq } from "../types";

export const useUpdateTwinFlowFactory = () => {
  const api = useContext(PrivateApiContext);

  async function updateTwinFlowFactory({
    body,
  }: {
    body: TwinFlowFactoryUpdateRq;
  }) {
    const { error } = await api.twinFlowFactory.update({ body });

    if (error) {
      throw new Error(
        "Failed to update twinflow factory due to API error",
        error
      );
    }
  }

  return { updateTwinFlowFactory };
};
