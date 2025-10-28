import { useCallback, useContext, useState } from "react";

import {
  DataListOption_DETAILED,
  hydrateDatalistOptionFromMap,
} from "@/entities/datalist-option";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useDatalistOption = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDatalistOptionById = useCallback(
    async (dataListOptionId: string): Promise<DataListOption_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.datalistOption.getById({
          dataListOptionId,
        });

        if (error) {
          throw new Error("Failed to fetch datalist options due to API error");
        }

        if (isUndefined(data.option)) {
          throw new Error(
            "Invalid response data while fetching datalist options"
          );
        }

        return hydrateDatalistOptionFromMap(data.option, data.relatedObjects);
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchDatalistOptionById, loading };
};
