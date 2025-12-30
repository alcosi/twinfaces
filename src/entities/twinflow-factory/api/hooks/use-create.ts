import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinFlowFactoryCreateRq } from "../types";

export const useTwinFlowFactoryCreate = () => {
  const api = useContext(PrivateApiContext);

  const createTwinFlowFactory = useCallback(
    async ({ body }: { body: TwinFlowFactoryCreateRq }) => {
      try {
        const { error } = await api.twinFlowFactory.create({ body });

        if (error) {
          throw new Error("Failed to create twinflow factory");
        }
      } catch (error) {
        console.error("Failed to create twinflow factory:", error);
        throw new Error("An error occured while creating twinflow factory");
      }
    },
    [api]
  );

  return { createTwinFlowFactory };
};
