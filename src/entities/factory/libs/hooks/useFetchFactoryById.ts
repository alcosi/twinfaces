import { useCallback, useContext } from "react";
import { ApiContext } from "@/shared/api";
import { Factory } from "@/entities/factory";

export function useFetchFactoryById() {
  const api = useContext(ApiContext);

  // TODO: Change to real getById one it's implemented on backend
  const fetchFactoryById = useCallback(
    async (id: string): Promise<Factory> => {
      try {
        const { data, error } = await api.factory.search({
          pagination: {
            pageIndex: 0,
            pageSize: 1,
          },
          filters: {
            idList: [id],
          },
        });

        if (error) {
          throw error;
        }

        if (data.factories == null || data.factories.length == 0) {
          throw new Error(`Factory with ID ${id} not found.`);
        }

        return data.factories[0]!;
      } catch (error) {
        console.error(`Failed to find factory by ID: ${id}`, error);
        throw new Error(`Failed to find factory with ID ${id}`);
      }
    },
    [api]
  );

  return { fetchFactoryById };
}
