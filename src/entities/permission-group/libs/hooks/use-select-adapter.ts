import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import {
  PermissionGroup_DETAILED,
  useFetchPermissionGroupById,
  usePermissionGroupSearchV1,
} from "../../api";

export function usePermissionGroupSelectAdapter(): SelectAdapter<PermissionGroup_DETAILED> {
  const { fetchPermissionGroupById } = useFetchPermissionGroupById();
  const { searchPermissionGroups } = usePermissionGroupSearchV1();

  async function getById(id: string) {
    return await fetchPermissionGroupById({
      groupId: id,
      query: {
        showPermissionGroup2TwinClassMode: "DETAILED",
        showPermissionGroupMode: "DETAILED",
      },
    });
  }

  async function getItems(search: string) {
    const response = await searchPermissionGroups({ search });
    return response.data;
  }

  function renderItem({ name, key }: PermissionGroup_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
