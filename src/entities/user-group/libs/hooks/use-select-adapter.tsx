import { SelectAdapter } from "@/shared/libs";

import { UserGroup_DETAILED, useUserGroupSearchV1 } from "../../api";

export function useUserGroupSelectAdapter(): SelectAdapter<UserGroup_DETAILED> {
  const { searchUserGroups } = useUserGroupSearchV1();

  async function getById(id: string) {
    return { id } as UserGroup_DETAILED;
  }

  async function getItems(search: string) {
    const response = await searchUserGroups({
      search,
      pagination: { pageIndex: 0, pageSize: 10 },
    });
    return response.data;
  }

  function renderItem({ name }: UserGroup_DETAILED) {
    return name;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
