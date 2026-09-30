import { useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { FactoryUpdate } from "../types";

export function useUpdateFactory() {
  const api = useContext(PrivateApiContext);

  async function updateFactory({
    factoryId,
    body,
  }: {
    factoryId: string;
    body: Omit<FactoryUpdate, "id">;
  }) {
    const { error } = await api.factory.update({
      body: { factories: [{ id: factoryId, ...body }] },
    });

    if (error) {
      throw new Error("Failed to update factory due to API error");
    }
  }

  return { updateFactory };
}
