import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateTwinValidatorFromMap } from "../../libs";
import { TwinValidator_DETAILED } from "../types";

/**
 * There is no dedicated view endpoint in use for a single validator — the search
 * endpoint narrowed to one id returns the same shape, related objects included.
 */
export function useFetchTwinValidatorById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchTwinValidatorById = useCallback(
    async (id: string): Promise<TwinValidator_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.twinValidator.search({
          pagination: { pageIndex: 0, pageSize: 1 },
          filters: { idList: [id] },
        });

        if (error) {
          throw error;
        }

        if (isUndefined(data?.validators) || isEmptyArray(data.validators)) {
          throw new Error(`Validator with ID ${id} not found.`);
        }

        return hydrateTwinValidatorFromMap(
          data.validators[0]!,
          data.relatedObjects
        );
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinValidatorById, isLoading };
}
