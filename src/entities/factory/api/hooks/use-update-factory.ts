import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryUpdateRq } from "../types";

export function useUpdateFactory() {
  const api = useContext(PrivateApiContext);

  async function updateFactory({
    factoryId,
    body,
  }: {
    factoryId: string;
    body: FactoryUpdateRq;
  }) {
    const { error } = await api.factory.update({ id: factoryId, body });

    if (error) {
      throw new Error("Failed to fetch factory due to API error", error);
    }
  }

  return { updateFactory };
}
