import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinClassFieldCreateRq } from "../types";

export const useTwinClassFieldCreate = () => {
  const api = useContext(PrivateApiContext);

  const createTwinClassField = useCallback(
    async ({ body }: { body: TwinClassFieldCreateRq }) => {
      const { data, error } = await api.twinClassField.create({ body });

      if (error) {
        throw error;
      }

      return data?.fields?.[0]?.id;
    },
    [api]
  );

  return { createTwinClassField };
};
