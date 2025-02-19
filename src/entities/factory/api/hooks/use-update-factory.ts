import { ApiContext } from "@/shared/api";
import { useContext } from "react";
import { FactoryUpdateRq } from "../types";

export function useUpdateFactory() {
  const api = useContext(ApiContext);

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
