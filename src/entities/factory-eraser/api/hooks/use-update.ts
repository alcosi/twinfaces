import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryEraserUpdate } from "../types";

export const useFactoryEraserUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateFactoryEraser = useCallback(
    async ({
      factoryEraserId,
      body,
    }: {
      factoryEraserId: string;
      body: FactoryEraserUpdate;
    }) => {
      return await api.factoryEraser.update({ factoryEraserId, body });
    },
    [api]
  );

  return { updateFactoryEraser };
};
