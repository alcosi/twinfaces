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
      body: Omit<FactoryEraserUpdate, "id">;
    }) => {
      return await api.factoryEraser.update({
        body: { erasers: [{ id: factoryEraserId, ...body }] },
      });
    },
    [api]
  );

  return { updateFactoryEraser };
};
