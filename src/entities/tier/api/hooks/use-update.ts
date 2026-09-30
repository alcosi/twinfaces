import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { TierUpdate } from "../types";

export function useUpdateTier() {
  const api = useContext(PrivateApiContext);

  const updateTier = useCallback(
    async ({
      tierId,
      body,
    }: {
      tierId: string;
      body: Omit<TierUpdate, "id">;
    }) => {
      const { error } = await api.tier.update({
        body: { tiers: [{ id: tierId, ...body }] },
      });

      if (error) {
        throw new Error("Failed to update tier due to API error");
      }
    },
    [api]
  );

  return { updateTier };
}
