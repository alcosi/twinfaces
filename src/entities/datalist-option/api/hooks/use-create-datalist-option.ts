import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { DataListOptionCreateRqDV1 } from "../types";

// TODO: Apply caching-strategy
export const useCreateDatalistOption = () => {
  const api = useContext(PrivateApiContext);

  const createDatalistOption = useCallback(
    async ({ body }: { body: DataListOptionCreateRqDV1 }) => {
      const { error } = await api.datalistOption.create({ body });

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createDatalistOption };
};
