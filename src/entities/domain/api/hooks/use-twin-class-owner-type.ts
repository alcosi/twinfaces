import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext } from "react";

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

      if (isUndefined(data.twinClassOwnerTypes)) {
        throw new Error(
          "Failed to fetch class owner type list due to API error"
        );
      }

      return data.twinClassOwnerTypes;
    } catch (error) {
      throw new Error("Failed to fetch class owner type list due to API error");
    }
  }, [api]);

  return { fetchClassOwnerTypeList };
};
