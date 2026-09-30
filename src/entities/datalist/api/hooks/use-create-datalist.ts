import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { DataListCreate } from "../types";

export const useDatalistCreate = () => {
  const api = useContext(PrivateApiContext);

  const createDatalist = useCallback(
    async ({ body }: { body: DataListCreate }) => {
      const { data, error } = await api.datalist.create({
        body: { dataLists: [body] },
      });

      if (error) {
        throw error;
      }

      return data?.dataListList?.[0]?.id;
    },
    [api]
  );

  return { createDatalist };
};
