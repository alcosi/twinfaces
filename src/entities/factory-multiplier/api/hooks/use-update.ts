import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryMultiplierUpdate } from "../types";

export function useUpdateFactoryMultiplier() {
  const api = useContext(PrivateApiContext);

  async function updateFactoryMultiplier({
    factoryMultiplierId,
    body,
  }: {
    factoryMultiplierId: string;
    body: Omit<FactoryMultiplierUpdate, "id">;
  }) {
    const { error } = await api.factoryMultiplier.update({
      body: { factoryMultipliers: [{ id: factoryMultiplierId, ...body }] },
    });

    if (error) {
      throw new Error("Failed to update factory multiplier due to API error");
    }
  }

  return { updateFactoryMultiplier };
}
