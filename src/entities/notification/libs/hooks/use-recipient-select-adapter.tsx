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

  async function getItems(search: string) {
    const { data } = await searchRecipient({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: {
        nameLikeList: search ? [wrapWithPercent(search)] : [],
      },
    });

    return data ?? [];
  }

  function renderItem({ id, name }: Recipient_DETAILED) {
    return isPopulatedString(name) ? `${name} : ${id}` : id;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
