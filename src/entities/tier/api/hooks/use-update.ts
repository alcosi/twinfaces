import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TierUpdateRq } from "../types";

export function useUpdateTier() {
  const api = useContext(PrivateApiContext);

  const updateTier = useCallback(
    async ({ tierId, body }: { tierId: string; body: TierUpdateRq }) => {
      const { error } = await api.tier.update({ tierId, body });

      if (error) {
        throw new Error("Failed to update tier due to API error");
      }
    },
    [api]
  );

  return { updateTier };
}
