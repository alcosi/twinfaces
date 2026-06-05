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

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchPermissionGroups({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name, key }: PermissionGroup_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${key}` : key;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
