import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import { LocaleV1, useFetchLocaleList } from "../../api";

export function useLocalListSelectAdapter(): SelectAdapter<LocaleV1> {
  const { fetchLocaleList } = useFetchLocaleList();

  async function getById(id: string) {
    return { id } as LocaleV1;
  }

  async function getItems() {
    const items = await fetchLocaleList();
    return items;
  }

  function renderItem({ id, name }: LocaleV1) {
    return isPopulatedString(name) ? `${id} : ${name}` : id;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
