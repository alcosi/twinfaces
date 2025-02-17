import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { DataListOptionCreateRqDV1 } from "../types";

// TODO: Apply caching-strategy
export const useCreateDatalistOption = () => {
  const api = useContext(ApiContext);

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
