import { TwinClassField_DETAILED } from "@/entities/twinClassField";
import { SelectAdapter } from "@/shared/libs";

export function useTwinClassFieldSelectAdapter(): SelectAdapter<TwinClassField_DETAILED> {
  async function getById(id: string) {
    // TODO: Apply valid logic here
    return { id } as TwinClassField_DETAILED;
  }

  async function getItems(search: string) {
    // TODO: Apply valid logic here
    return [];
  }

  function getItemKey(item: TwinClassField_DETAILED) {
    return item.id;
  }

  function getItemLabel({ key }: TwinClassField_DETAILED) {
    return key;
  }

  return {
    getById,
    getItems,
    getItemKey,
    getItemLabel,
  };
}
