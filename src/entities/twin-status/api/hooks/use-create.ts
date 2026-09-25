import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TwinStatusCreateRq } from "../types";

export const useStatusCreate = () => {
  const api = useContext(PrivateApiContext);

  const createStatus = useCallback(
    async ({
      twinClassId,
      body,
    }: {
      twinClassId: string;
      body: TwinStatusCreateRq;
    }) => {
      const { data, error } = await api.twinStatus.create({
        twinClassId,
        body,
      });

      if (error) {
        throw error;
      }

      return data?.twinStatus?.id;
    },
    [api]
  );

  return { createStatus };
};
