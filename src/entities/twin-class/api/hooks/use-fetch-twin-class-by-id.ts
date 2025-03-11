import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";
import { operations } from "@/shared/api/generated/schema";
import { isUndefined } from "@/shared/libs";

import { hydrateTwinClassFromMap } from "../../libs";
import { TwinClass_DETAILED } from "../types";

// TODO: Apply caching-strategy after discussing with team
export const useFetchTwinClassById = () => {
  const api = useContext(PrivateApiContext);

  const fetchTwinClassById = useCallback(
    async ({
      id,
      query,
    }: {
      id: string;
      query?: operations["twinClassViewV1"]["parameters"]["query"];
    }): Promise<TwinClass_DETAILED> => {
      const _query = query ?? {
        showTwinClassMode: "DETAILED",
        showTwin2TwinClassMode: "SHORT",
      };

      try {
        const { data, error } = await api.twinClass.getById({
          id,
          query: _query,
        });

        if (error) {
          throw new Error("Failed to fetch twin class due to API error", error);
        }

        if (isUndefined(data?.twinClass)) {
          throw new Error("Response does not have twin-class data", error);
        }

        return hydrateTwinClassFromMap(data.twinClass);
      } catch (error) {
        throw new Error(`Failed to find twin class with ID ${id}`);
      }
    },
    [api]
  );

  return { fetchTwinClassById };
};
