import { useCallback, useContext, useState } from "react";

import {
  TwinClassFieldV2_DETAILED,
  hydrateTwinClassFieldFromMap,
} from "@/entities/twin-class-field";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs/types";

export const useFetchTwinClassFieldById = () => {
  const api = useContext(PrivateApiContext);
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
