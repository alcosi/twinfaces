import { ApiContext } from "@/shared/api";
import { operations } from "@/shared/api/generated/schema";
import { useCallback, useContext } from "react";

// TODO: Apply caching-strategy after discussing with team
export const useFetchTwinClassById = () => {
  const api = useContext(ApiContext);

  const fetchTwinClassById = useCallback(
    async ({
      id,
      query,
    }: {
      id: string;
      query?: operations["twinClassViewV1"]["parameters"]["query"];
    }): Promise<ReturnType<typeof api.twinClass.getById>> => {
      const _query = query ?? {
        showTwinClassMode: "DETAILED",
        showTwin2TwinClassMode: "SHORT",
      };

      try {
        return await api.twinClass.getById({ id, query: _query });
      } catch (error) {
        console.error(`Failed to find twin class by ID: ${id}`, error);
        throw new Error(`Failed to find twin class with ID ${id}`);
      }
    },
    [api]
  );

  return { fetchTwinClassById };
};
