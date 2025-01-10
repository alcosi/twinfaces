import {
  isPopulatedString,
  SelectAdapter,
  wrapWithPercent,
} from "@/shared/libs";
import { Avatar } from "@/shared/ui";
import { UserIcon } from "lucide-react";
import { DomainUser_DETAILED, useDomainUserSearchV1 } from "../../api";

export function useUserSelectAdapter(): SelectAdapter<DomainUser_DETAILED> {
  const { searchUsers } = useDomainUserSearchV1();

  async function getById(id: string) {
    // TODO: Emulates user fetch;
    // replace with the correct endpoint when available.
    const { data } = await searchUsers({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: {
        userIdList: isPopulatedString(id) ? [id] : undefined,
      },
    });

    return data[0];
  }

  async function getItems(search: string) {
    const { data } = await searchUsers({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: {
        nameLikeList: isPopulatedString(search)
          ? [wrapWithPercent(search)]
          : undefined,
      },
    });

    return data;
  }

  function renderItem({ user }: DomainUser_DETAILED) {
    const { fullName, avatar } = user;

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
