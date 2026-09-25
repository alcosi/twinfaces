import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinClassCreateRq } from "../types";

export const useTwinClassCreate = () => {
  const api = useContext(PrivateApiContext);

  const createTwinClass = useCallback(
    async ({ body }: { body: TwinClassCreateRq }) => {
      const { data, error } = await api.twinClass.create({ body });

      if (error) {
        throw error;
      }

      return data?.twinClassList?.[0]?.id;
    },
    [api]
  );

  return { createTwinClass };
};
