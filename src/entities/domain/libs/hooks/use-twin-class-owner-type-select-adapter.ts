import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import { TwinClassOwnerType, useTwinClassOwnerType } from "../../api";

export function useTwinClassOwnerTypeSelectAdapter(): SelectAdapter<TwinClassOwnerType> {
  const { fetchClassOwnerTypeList } = useTwinClassOwnerType();

  async function getById(id: string) {
    return { id } as TwinClassOwnerType;
  }

  async function getItems() {
    const items = await fetchClassOwnerTypeList();
    return items;
  }

  function renderItem({ id, name }: TwinClassOwnerType) {
    return isPopulatedString(name) ? name : id;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
