import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinFlowFactoryUpdateRq } from "../types";

export const useUpdateTwinFlowFactory = () => {
  const api = useContext(PrivateApiContext);

  const updateTwinFlowFactory = useCallback(
    async ({ body }: { body: TwinFlowFactoryUpdateRq }) => {
      return await api.twinFlowFactory.update({ body });
    },
    [api]
  );

  return { updateTwinFlowFactory };
};
