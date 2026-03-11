import { useCallback, useContext, useState } from "react";

import { ValidatorSet_DETAILED } from "@/entities/validator-set";
import { PrivateApiContext } from "@/shared/api";

export function useFetchValidatorSetById() {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchValidatorSetById = useCallback(
    async (id: string): Promise<ValidatorSet_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.validatorSet.search({
          pagination: { pageIndex: 0, pageSize: 10 },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          new Error("Failed to fetch validator set due to API error", error);
        }

        return data && data.validatorSets && data.validatorSets.length > 0
          ? (data.validatorSets[0] as ValidatorSet_DETAILED)
          : undefined;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return {
    fetchValidatorSetById,
    loading,
  };
}
