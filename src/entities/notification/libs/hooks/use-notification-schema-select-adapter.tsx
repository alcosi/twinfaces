import {
  SelectAdapter,
  isPopulatedString,
  wrapWithPercent,
} from "@/shared/libs";

import { NotificationSchema, useNotificationSchemaSearch } from "../../api";

export function useNotificationSchemaSelectAdapter(): SelectAdapter<NotificationSchema> {
  const { searchNotificationSchema } = useNotificationSchemaSearch();

  async function getById(id: string) {
    const { data } = await searchNotificationSchema({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: {
        idList: [id],
      },
    });

    return data?.[0];
  }

  async function getItems(search: string) {
    const { data } = await searchNotificationSchema({
      pagination: { pageIndex: 0, pageSize: 10 },
      filters: {
        nameLikeList: search ? [wrapWithPercent(search)] : [],
      },
    });

    return data ?? [];
  }

  function renderItem({ id, name }: NotificationSchema) {
    return isPopulatedString(name) ? `${name} : ${id}` : id;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
