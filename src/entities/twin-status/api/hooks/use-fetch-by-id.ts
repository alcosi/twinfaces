import { useCallback, useContext, useState } from "react";

import {
  TwinStatus_DETAILED,
  hydrateTwinStatusFromMap,
} from "@/entities/twin-status";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useFetchTwinStatusById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTwinStatusById = useCallback(
    async (id: string): Promise<TwinStatus_DETAILED> => {
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

        return hydrateTwinStatusFromMap(data.twinStatus, data.relatedObjects);
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinStatusById, loading };
};
