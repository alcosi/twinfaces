import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateProjectionFromMap } from "../../libs";
import { Projection } from "../types";

export function useFetchProjectionById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchProjectionById = useCallback(
    async (id: string): Promise<Projection | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.projection.search({
          pagination: {
            pageIndex: 0,
            pageSize: 1,
          },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw error;
        }

        if (isUndefined(data.projections) || isEmptyArray(data.projections)) {
          throw new Error(`Projection with ID ${id} not found.`);
        }

        if (data.relatedObjects) {
          return hydrateProjectionFromMap(
            data.projections[0]!,
            data.relatedObjects
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchProjectionById, isLoading };
}
