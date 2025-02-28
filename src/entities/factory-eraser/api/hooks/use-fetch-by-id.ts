"use client";

import { useCallback, useContext, useState } from "react";

import {
  FactoryEraserRqQuery,
  FactoryEraser_DETAILED,
  hydrateFactoryEraserFromMap,
} from "@/entities/factory-eraser";
import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

// TODO: Apply caching-strategy
export const useFactoryEraserById = () => {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFactoryEraserById = useCallback(
    async ({
      eraserId,
      query,
    }: {
      eraserId: string;
      query: FactoryEraserRqQuery;
    }): Promise<FactoryEraser_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.factoryEraser.getById({
          eraserId,
          query,
        });

        if (error) {
          throw new Error("Failed to fetch factory eraser due to API error");
        }

        if (isUndefined(data.eraser)) {
          throw new Error(
            "Invalid response data while fetching factory eraser"
          );
        }

        const eraser = hydrateFactoryEraserFromMap(
          data.eraser,
          data.relatedObjects
        );

        return eraser;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchFactoryEraserById, loading };
};
