import { useContext } from "react";

import { ValidatorSetUpdateRq } from "@/entities/validator-set";
import { PrivateApiContext } from "@/shared/api";

export function useUpdateValidatorSet() {
  const api = useContext(PrivateApiContext);

  async function updateValidatorSet({ body }: { body: ValidatorSetUpdateRq }) {
    const { error } = await api.validatorSet.update({ body });
    if (error)
      throw new Error("Failed to update validator set due to API error", error);
  }

  return { updateValidatorSet };
}
