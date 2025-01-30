import { isPopulatedString, SelectAdapter } from "@/shared/libs";
import { TwinClassOwnerType, useTwinClassOwnerType } from "../../api";

export function useTwinClassOwnerTypeSelectAdapter(): SelectAdapter<TwinClassOwnerType> {
  const { fetchClassOwnerTypeList } = useTwinClassOwnerType();

  async function getById(id: string) {
    return { id } as TwinClassOwnerType;
  }

  async function getItems() {
    const response = await fetchClassOwnerTypeList();
    return response.twinClassOwnerTypes as TwinClassOwnerType[];
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
