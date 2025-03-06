import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { DataListCreateRqV1 } from "../types";

// TODO: Apply caching-strategy
export const useDatalistCreate = () => {
  const api = useContext(PrivateApiContext);

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
