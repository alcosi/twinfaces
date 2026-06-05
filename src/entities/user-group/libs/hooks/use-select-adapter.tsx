import { SelectAdapter } from "@/shared/libs";

import { UserGroup_DETAILED, useUserGroupSearchV1 } from "../../api";

export function useUserGroupSelectAdapter(): SelectAdapter<UserGroup_DETAILED> {
  const { searchUserGroups } = useUserGroupSearchV1();

  async function getById(id: string) {
    return { id } as UserGroup_DETAILED;
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchUserGroups({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name }: UserGroup_DETAILED) {
    return name;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
