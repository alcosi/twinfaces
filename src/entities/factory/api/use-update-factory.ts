import { ApiContext } from "@/shared/api";
import { useContext } from "react";
import { FactoryUpdateRq } from "./types";
import { FactoryContext } from "../libs";

export function useUpdateFactory() {
  const { factory, refresh } = useContext(FactoryContext);
  const api = useContext(ApiContext);

  async function updateFactory(newFactory: FactoryUpdateRq) {
    try {
      await api.factory.update({ id: factory.id, body: newFactory });
      refresh();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return { updateFactory };
}
