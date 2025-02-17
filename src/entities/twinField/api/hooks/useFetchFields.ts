import { TwinFieldUI } from "@/entities/twinField";
import { ApiContext, PagedResponse } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext } from "react";
import { hydrateTwinFieldFromMap } from "../../libs";

// TODO: Apply caching-strategy
export const useFetchFields = () => {
  const api = useContext(ApiContext);

  const fetchFieldsByTwinId = useCallback(
    async ({
      twinId,
    }: {
      twinId: string;
    }): Promise<PagedResponse<TwinFieldUI>> => {
      const { data, error } = await api.twin.getFieldsById({ twinId });

      if (error) {
        throw new Error("Failed to fetch twin due to API error");
      }

      if (isUndefined(data.twin)) {
        throw new Error("Invalid response data while fetching twin");
      }

      const twinFields = Object.entries(data?.twin?.fields ?? []).map((dto) =>
        hydrateTwinFieldFromMap({
          dto,
          relatedObjects: data.relatedObjects,
          twinClassId: data?.twin?.twinClassId,
        })
      );

      return { data: twinFields, pagination: {} };
    },
    [api]
  );

  return { fetchFieldsByTwinId };
};
