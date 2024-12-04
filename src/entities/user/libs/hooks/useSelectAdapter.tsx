import { ApiContext } from "@/shared/api";
import { isPopulatedString, SelectAdapter } from "@/shared/libs";
import { Avatar } from "@/shared/ui";
import { UserIcon } from "lucide-react";
import { useContext } from "react";
import { User_DETAILED } from "../../api";

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

  function renderItem({ fullName, avatar }: User_DETAILED) {
    return (
      <div className="flex gap-2">
        <div className="flex grow">
          {isPopulatedString(avatar) ? (
            <Avatar url={avatar} size="sm" />
          ) : (
            <UserIcon className="h-4 w-4" />
          )}
        </div>
        <span className="truncate">{fullName}</span>
      </div>
    );
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
