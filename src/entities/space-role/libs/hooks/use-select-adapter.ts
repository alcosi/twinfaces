import { SelectAdapter } from "@/shared/libs";

import { SpaceRole, useSpaceRoleSearch } from "../../api";

export function useSpaceRoleSelectAdapter(): SelectAdapter<SpaceRole> {
  const { searchSpaceRole } = useSpaceRoleSearch();

  async function getById() {
    const response = await searchSpaceRole();

    return response.data[0];
  }

  async function getItems() {
    const response = await searchSpaceRole();

    return response.data;
  }

  function renderItem({ twinClass, key }: SpaceRole) {
    return twinClass ? `${twinClass.name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
