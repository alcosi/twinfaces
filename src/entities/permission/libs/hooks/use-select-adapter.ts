import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import { Permission_DETAILED, usePermissionSearchV1 } from "../../api";

export function usePermissionSelectAdapter(): SelectAdapter<Permission_DETAILED> {
  const { searchPermissions } = usePermissionSearchV1();

  async function getById(id: string) {
    // NOTE: Emulating `fetchById` request using `search`
    const response = await searchPermissions({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: { idList: [id] },
    });
    return response.data[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchPermissions({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name, key }: Permission_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
