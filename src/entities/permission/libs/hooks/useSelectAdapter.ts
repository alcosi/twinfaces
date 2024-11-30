import { isPopulatedString, SelectAdapter } from "@/shared/libs";
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

  async function getItems(search: string) {
    const response = await searchPermissions({ search });
    return response.data;
  }

  function getItemKey(item: Permission_DETAILED) {
    return item.id;
  }

  function getItemLabel({ name, key }: Permission_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    getItemKey,
    getItemLabel,
  };
}
