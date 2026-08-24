import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinValidatorCreateRq } from "../types";

export function useTwinValidatorCreate() {
  const api = useContext(PrivateApiContext);

  const createTwinValidator = useCallback(
    async ({ body }: { body: TwinValidatorCreateRq }) => {
      const { error } = await api.twinValidator.create({ body });

      if (error) {
        throw new Error("Failed to create validator");
      }
    },
    [api]
  );

  return { createTwinValidator };
}
