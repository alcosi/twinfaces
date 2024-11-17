import { SelectAdapter } from "@/shared/libs";
import { Twin } from "../../api";

export function useTwinSelectAdapter(): SelectAdapter<Twin> {
  async function getById(_: string) {
    return {} as Twin;
  }

  async function getItems(_: string) {
    return [];
  }

  function getItemKey(item: Twin) {
    return item.id ?? "";
  }

  function getItemLabel({ name }: Twin) {
    return name ?? "";
  }

  return {
    getById,
    getItems,
    getItemKey,
    getItemLabel,
  };
}
