import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useFetchLocaleList = () => {
  const api = useContext(PrivateApiContext);

  const fetchLocaleList = useCallback(async () => {
    try {
      const { data, error } = await api.domain.getLocaleList();

      if (error) {
        throw new Error("Failed to fetch locale list due to API error");
      }

      if (isUndefined(data.localeList)) {
        throw new Error("Failed to fetch locale list due to API error");
      }

      return data.localeList;
    } catch {
      throw new Error("Failed to fetch locale list due to API error");
    }
  }, [api]);

  return { fetchLocaleList };
};
