import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TierCreateRq } from "../types";

export const useTierCreate = () => {
  const api = useContext(PrivateApiContext);

  const createTier = useCallback(
    async ({ body }: { body: TierCreateRq }) => {
      try {
        const { error } = await api.tier.create({ body });

        if (error) {
          throw new Error("Failed to create tier");
        }
      } catch {
        throw new Error("An error occured while creating tier");
      }
    },
    [api]
  );

  return { createTier };
};
