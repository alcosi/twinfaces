import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { TwinStatusV2 } from "../../api";

// TODO: Apply caching-strategy after discussing with team
export const useFetchTwinStatusById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTwinStatusById = useCallback(
    async (id: string): Promise<TwinStatusV2> => {
      setLoading(true);
      try {
        const { data, error } = await api.twinStatus.getById({
          twinStatusId: id,
        });

        if (error) {
          throw new Error(
            "Failed to fetch twin-status due to API error",
            error
          );
        }

        if (isUndefined(data?.twinStatus)) {
          throw new Error("Response does not have twin-status data", error);
        }

        return data.twinStatus;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinStatusById, loading };
};
