import { ApiContext, PagedResponse } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext } from "react";
import { TwinField } from "@/entities/twinField";

// TODO: Apply caching-strategy
export const useFetchFields = () => {
  const api = useContext(ApiContext);

  const fetchFieldsByTwinId = useCallback(
    async ({
      twinId,
    }: {
      twinId: string;
    }): Promise<PagedResponse<TwinField>> => {
      const { data, error } = await api.twin.getFieldById({ twinId });

      if (error) {
        throw new Error("Failed to fetch twin due to API error");
      }

      if (isUndefined(data.twin)) {
        throw new Error("Invalid response data while fetching twin");
      }

      const fields = data?.twin?.fields || [];
      const twinFields = Object.entries(fields).map(([key, value]) => ({
        key,
        value,
      }));

      return { data: twinFields, pagination: {} };
    },
    [api]
  );

  return { fetchFieldsByTwinId };
};
