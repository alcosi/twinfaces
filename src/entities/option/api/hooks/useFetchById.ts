import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext } from "react";
import { DataListOptionV1 } from "@/entities/option";

// TODO: Apply caching-strategy
export const useDatalistOption = () => {
  const api = useContext(ApiContext);

  const fetchDatalistOptionById = useCallback(
    async (dataListOptionId: string): Promise<DataListOptionV1> => {
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
    },
    [api]
  );

  return { fetchDatalistOptionById };
};
