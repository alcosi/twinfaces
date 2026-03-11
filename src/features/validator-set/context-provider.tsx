import { ReactNode, createContext, useEffect, useState } from "react";

import {
  ValidatorSet_DETAILED,
  useFetchValidatorSetById,
} from "@/entities/validator-set";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type ValidatorSetContextProps = {
  validatorSetId: string;
  validatorSet: ValidatorSet_DETAILED;
  refresh: () => Promise<void>;
};
export const ValidatorSetContext = createContext<ValidatorSetContextProps>(
  {} as ValidatorSetContextProps
);
export function ValidatorSetContextProvider({
  validatorSetId,
  children,
}: {
  validatorSetId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [validatorSetId]);

  const [validatorSet, setValidatorSet] = useState<
    ValidatorSet_DETAILED | undefined
  >(undefined);

  const { fetchValidatorSetById, loading } = useFetchValidatorSetById();

  async function refresh() {
    try {
      const fetchedValidatorSet = await fetchValidatorSetById(validatorSetId);

      if (fetchedValidatorSet) {
        setValidatorSet(fetchedValidatorSet);
      }
    } catch (error) {
      console.error("Failed to fetch validator set:", error);
    }
  }

  if (isUndefined(validatorSet) || loading) return <LoadingOverlay />;

  return (
    <ValidatorSetContext.Provider
      value={{ validatorSetId, validatorSet, refresh }}
    >
      {loading ? <LoadingOverlay /> : children}
    </ValidatorSetContext.Provider>
  );
}
