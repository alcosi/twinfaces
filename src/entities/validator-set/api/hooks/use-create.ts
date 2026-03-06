import { useCallback, useContext } from "react";

import { ValidatorSetCreateRq } from "@/entities/validator-set";
import { PrivateApiContext } from "@/shared/api";

export const useValidatorSetCreate = () => {
  const api = useContext(PrivateApiContext);

  const createValidatorSet = useCallback(
    async ({ body }: { body: ValidatorSetCreateRq }) => {
      try {
        const { error } = await api.validatorSet.create({ body });
        if (error) {
          throw new Error("Failed to create validator sets");
        }
      } catch (error) {
        throw new Error("An error occured while creating validator sets");
      }
    },
    [api]
  );

  return { createValidatorSet };
};
