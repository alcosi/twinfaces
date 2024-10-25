import { ApiContext } from "@/lib/api/api";
import { useCallback, useContext } from "react";
import { TwinClass } from "../types";

// TODO: Apply caching-strategy after discussing with team
export const useFetchTwinClassById = () => {
  const api = useContext(ApiContext);

  const fetchTwinClassById = useCallback(
    async (id: string): Promise<TwinClass | undefined> => {
      try {
        const { data } = await api.twinClass.getById({
          id,
          query: {
            showTwinClassMode: "DETAILED",
            showTwin2TwinClassMode: "SHORT",
          },
        });
        return data?.twinClass;
      } catch (error) {
        console.error(`Failed to find twin class by ID: ${id}`, error);
        throw new Error(`Failed to find twin class with ID ${id}`);
      }
    },
    [api]
  );

  return { fetchTwinClassById };
};
