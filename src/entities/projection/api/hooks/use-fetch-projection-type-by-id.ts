import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { ProjectionType } from "../types";

export function useFetchProjectionTypeById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchProjectionTypeById = useCallback(
    async (id: string): Promise<ProjectionType | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.projection.searchProjectionType({
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

        if (
          isUndefined(data.projectionTypes) ||
          isEmptyArray(data.projectionTypes)
        ) {
          throw new Error(`Projection type with ID ${id} not found.`);
        }

        return data.projectionTypes[0];
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchProjectionTypeById, isLoading };
}
