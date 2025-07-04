import { useCallback, useContext, useEffect } from "react";

import { TwinFieldUI } from "@/entities/twinField";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateTwinFieldFromMap } from "../../libs";

export const useFetchFields = () => {
  const api = useContext(PrivateApiContext);

  useEffect(() => {
    console.log(
      "🔁🔁🔁 PrivateApiContext value changed (useFetchFields):",
      api
    );
  }, [api]);

  useEffect(() => {
    console.log("✅✅✅ useFetchFields mounted");
    return () => console.log("❌❌❌ useFetchFields unmounted");
  });

  const fetchFieldsByTwinId = useCallback(
    async ({
      twinId,
    }: {
      twinId: string;
    }): Promise<
      PagedResponse<TwinFieldUI & { twinClassId: string | undefined }>
    > => {
      console.log("useFetchFields fetchFieldsByTwinId called!!!!!!!!!");
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
        })
      );

      const extendedTwinFields = twinFields.map((field) => ({
        ...field,
        twinClassId: data.twin?.twinClassId,
      }));

      return { data: extendedTwinFields, pagination: {} };
    },
    [api]
  );

  return { fetchFieldsByTwinId };
};
