import { useCallback, useContext, useState } from "react";
import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import {
  hydrateTwinClassFieldFromMap,
  TwinClassFieldV2_DETAILED,
} from "@/entities/twin-class-field";

// TODO: Apply caching-strategy after discussing with team
export const useFetchTwinClassFieldById = () => {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTwinClassFieldById = useCallback(
    async (fieldId: string): Promise<TwinClassFieldV2_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.twinClassField.getById({ fieldId });

        if (error) {
          throw new Error(
            "Failed to fetch twin-class-field due to API error",
            error
          );
        }

        if (isUndefined(data?.field)) {
          throw new Error(
            "Response does not have twin-class-field data",
            error
          );
        }

        const field = hydrateTwinClassFieldFromMap(
          data.field,
          data.relatedObjects
        );

        return field;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinClassFieldById, loading };
};
