import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext } from "react";
import { Twin } from "../types";

// TODO: Apply caching-strategy
export const useTwinFetchByIdV2 = () => {
  const api = useContext(ApiContext);

  const fetchTwinById = useCallback(
    async (id: string): Promise<Twin> => {
      const { data, error } = await api.twin.getById({
        id,
        query: {
          showTwinMode: "SHORT",
          showTwinAliasMode: "ALL",
        },
      });

      if (error) {
        throw new Error("Failed to fetch twin due to API error");
      }

      if (isUndefined(data.twin)) {
        throw new Error("Invalid response data while fetching twin");
      }

      return data.twin;
    },
    [api]
  );

  return { fetchTwinById };
};
