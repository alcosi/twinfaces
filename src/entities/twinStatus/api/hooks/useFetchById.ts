import { useCallback, useContext } from "react";
import { TwinStatus } from "../../api";
import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

// TODO: Apply caching-strategy after discussing with team
export const useFetchTwinStatusById = () => {
  const api = useContext(ApiContext);

  const fetchTwinStatusById = useCallback(
    async (id: string): Promise<TwinStatus> => {
      const { data, error } = await api.twinStatus.getById({
        twinStatusId: id,
      });

      if (error) {
        throw new Error("Failed to fetch twin-status due to API error", error);
      }

      if (isUndefined(data?.twinStatus)) {
        throw new Error("Response does not have twin-status data", error);
      }

      return data.twinStatus;
    },
    [api]
  );

  return { fetchTwinStatusById };
};
