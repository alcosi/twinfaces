import { UserIcon } from "lucide-react";
import { useRef, useState } from "react";

import {
  SelectAdapterWithFilters,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";
import { Avatar } from "@/shared/ui";

import {
  DomainUserFilters,
  DomainUser_DETAILED,
  useDomainUserSearchV1,
} from "../../api";

export function useUserSelectAdapterWithFilters(): SelectAdapterWithFilters<
  DomainUser_DETAILED,
  DomainUserFilters
> {
  const { searchUsers } = useDomainUserSearchV1();

  const filtersRef = useRef<DomainUserFilters>({});
  const [version, setVersion] = useState(0);

  function setFilters(filters: DomainUserFilters) {
    filtersRef.current = filters;
  }

  function invalidate() {
    setVersion((v) => v + 1);
  }

  async function getById(id: string) {
    const { data } = await searchUsers({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: {
        userIdList: isPopulatedString(id) ? [id] : undefined,
      },
    });

    return data[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const nameLikeList = [
      ...(isPopulatedString(search) ? [wrapWithPercent(search)] : []),
      ...(filtersRef.current.nameLikeList ?? []),
    ];

    const { data } = await searchUsers({
      pagination,
      filters: {
        ...filtersRef.current,
        nameLikeList: nameLikeList.length ? nameLikeList : undefined,
      },
    });

    return data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
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
    getItemsPaginated,
    renderItem,
    setFilters,
    invalidate,
    version,
  };
}
