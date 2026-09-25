import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { DataListOptionCreateRqDV1 } from "../types";

export const useCreateDatalistOption = () => {
  const api = useContext(PrivateApiContext);

  const createDatalistOption = useCallback(
    async ({ body }: { body: DataListOptionCreateRqDV1 }) => {
      const { data, error } = await api.datalistOption.create({ body });

      if (error) {
        throw error;
      }

      return data?.option?.id;
    },
    [api]
  );

  return { createDatalistOption };
};
