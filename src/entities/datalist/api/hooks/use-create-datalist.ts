import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { DataListCreateRqV1 } from "../types";

export const useDatalistCreate = () => {
  const api = useContext(PrivateApiContext);

  const createDatalist = useCallback(
    async ({ body }: { body: DataListCreateRqV1 }) => {
      const { data, error } = await api.datalist.create({ body });

      if (error) {
        throw error;
      }

      return data?.dataList?.id;
    },
    [api]
  );

  return { createDatalist };
};
