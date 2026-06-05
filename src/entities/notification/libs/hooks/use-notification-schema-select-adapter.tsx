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

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const { data } = await searchNotificationSchema({
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

  function renderItem({ id, name }: NotificationSchema) {
    return isPopulatedString(name) ? `${name}` : id;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
