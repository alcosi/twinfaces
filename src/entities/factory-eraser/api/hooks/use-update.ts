import { useCallback, useContext } from "react";

import { ApiContext } from "@/shared/api";

import { FactoryEraserUpdate } from "../types";

// TODO: Apply caching-strategy
export const useFactoryEraserUpdate = () => {
  const api = useContext(ApiContext);

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
