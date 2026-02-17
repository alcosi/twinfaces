import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateTwinClassDynamicMarkerFromMap } from "../../libs";
import { TwinClassDynamicMarker_DETAILED } from "../types";

export const useTwinClassDynamicMarkerFetchByIdV1 = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTwinClassDynamicMarkerById = useCallback(
    async (id: string): Promise<TwinClassDynamicMarker_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.twinClass.searchDynamicMarkers({
          pagination: { pageIndex: 0, pageSize: 1 },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw new Error(
            "Failed to fetch twin class dynamic marker due to API error"
          );
        }

        const markers = data.dynamicMarkers ?? [];
        if (isUndefined(markers[0])) {
          throw new Error(
            "Invalid response data while fetching twin class dynamic marker"
          );
        }

        const marker = hydrateTwinClassDynamicMarkerFromMap(
          markers[0],
          data.relatedObjects
        );

        return marker;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchTwinClassDynamicMarkerById, loading };
};
