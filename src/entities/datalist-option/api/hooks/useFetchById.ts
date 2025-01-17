import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext, useState } from "react";
import { DataListOptionV3 } from "@/entities/datalist-option";

// TODO: Apply caching-strategy
export const useDatalistOption = () => {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDatalistOptionById = useCallback(
    async (dataListOptionId: string): Promise<DataListOptionV3> => {
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

        return data.option;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchDatalistOptionById, loading };
};
