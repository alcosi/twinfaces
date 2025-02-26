import { ApiContext } from "@/shared/api";
import { useContext } from "react";
import { FactoryMultiplierUpdateRq } from "../types";

export function useUpdateFactoryMultiplier() {
  const api = useContext(ApiContext);

  async function updateFactoryMultiplier({
    factoryMultiplierId,
    body,
  }: {
    factoryMultiplierId: string;
    body: FactoryMultiplierUpdateRq;
  }) {
    const { error } = await api.factoryMultiplier.update({
      id: factoryMultiplierId,
      body,
    });

    if (error) {
      throw new Error(
        "Failed to fetch factory multiplier due to API error",
        error
      );
    }
  }

  return { updateFactoryMultiplier };
}
