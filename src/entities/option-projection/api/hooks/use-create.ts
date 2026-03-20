import { useCallback, useContext } from "react";

import { OptionProjectionCreateRq } from "@/entities/option-projection";
import { PrivateApiContext } from "@/shared/api";

export const useOptionProjectionCreate = () => {
  const api = useContext(PrivateApiContext);

  const createOptionProjection = useCallback(
    async ({ body }: { body: OptionProjectionCreateRq }) => {
      try {
        const { error } = await api.optionProjection.create({ body });
        if (error) {
          throw new Error("Failed to create option projection");
        }
      } catch {
        throw new Error("An error occured while creating option projection");
      }
    },
    [api]
  );
  return { createOptionProjection };
};
