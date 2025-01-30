import { useCallback, useContext } from "react";
import { ApiContext } from "@/shared/api";

export const useTwinClassOwnerType = () => {
  const api = useContext(ApiContext);

  const fetchClassOwnerTypeList = useCallback(async () => {
    try {
      const { data, error } = await api.domain.fetchTwinClassOwnerType();

      if (error) {
        throw new Error(
          "Failed to fetch class owner type list due to API error"
        );
      }

      return data;
    } catch (error) {
      throw new Error("Failed to fetch class owner type list due to API error");
    }
  }, [api]);

  return { fetchClassOwnerTypeList };
};
