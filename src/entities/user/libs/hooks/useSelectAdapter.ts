import { SelectAdapter } from "@/shared/libs";
import { User_DETAILED } from "../../api";
import { useContext } from "react";
import { ApiContext } from "@/shared/api";

export function useUserSelectAdapter(): SelectAdapter<User_DETAILED> {
  const api = useContext(ApiContext);

  async function getById(id: string) {
    // TODO: Emulates user fetch;
    // replace with the correct endpoint when available.
    return { id } as User_DETAILED;
  }

  async function getItems(search: string) {
    try {
      // TODO: Emulates user search;
      // replace with the correct endpoint when available.
      const { data, error } = await api.twin.search({
        search,
        pagination: { pageIndex: 0, pageSize: 10 },
      });

      if (error) {
        throw new Error("Failed to fetch twins due to API error");
      }

      return Object.values(
        data.relatedObjects?.userMap ?? []
      ) as User_DETAILED[];
    } catch (error) {
      throw new Error("An error occurred while fetching twins");
    }
  }

  function renderItem({ fullName }: User_DETAILED) {
    return fullName;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
