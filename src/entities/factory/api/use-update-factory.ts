import { ApiContext } from "@/shared/api";
import { useContext } from "react";
import { FactoryUpdateRq } from "./types";

export function useUpdateFactory(
  factory: { id: string },
  fetchFactoryById: () => void
) {
  const api = useContext(ApiContext);

  async function updateFactory(newFactory: FactoryUpdateRq) {
    try {
      await api.factory.update({ id: factory.id, body: newFactory });
      fetchFactoryById();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return { updateFactory };
}
