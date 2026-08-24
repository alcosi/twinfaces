import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinValidatorUpdateRq } from "../types";

export function useTwinValidatorUpdate() {
  const api = useContext(PrivateApiContext);

  const updateTwinValidator = useCallback(
    async ({ body }: { body: TwinValidatorUpdateRq }) => {
      const { error } = await api.twinValidator.update({ body });

      if (error) {
        throw new Error("Failed to update validator");
      }
    },
    [api]
  );

  return { updateTwinValidator };
}
