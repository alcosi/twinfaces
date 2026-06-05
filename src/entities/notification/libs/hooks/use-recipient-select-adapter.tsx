import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import { Recipient_DETAILED, useRecipientSearch } from "../../api";

export function useRecipientSelectAdapter(): SelectAdapter<Recipient_DETAILED> {
  const { searchRecipient } = useRecipientSearch();

  async function getById(id: string) {
    const { data } = await searchRecipient({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: {
        idList: [id],
      },
    });

    return data?.[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const { data } = await searchRecipient({
      pagination,
      filters: {
        nameLikeList: search ? [wrapWithPercent(search)] : [],
      },
    });

    return data ?? [];
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ id, name }: Recipient_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${id}` : id;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
