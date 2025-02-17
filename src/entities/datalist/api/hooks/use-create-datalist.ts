import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { DataListCreateRqV1 } from "../types";

// TODO: Apply caching-strategy
export const useDatalistCreate = () => {
  const api = useContext(ApiContext);

  const createDatalist = useCallback(
    async ({ body }: { body: DataListCreateRqV1 }) => {
      const { error } = await api.datalist.create({ body });

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createDatalist };
};
