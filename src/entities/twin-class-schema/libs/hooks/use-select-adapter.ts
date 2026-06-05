import { SelectAdapter } from "@/shared/libs";

import { TwinClassSchema_DETAILED } from "../../api";
import { useTwinClassSchemaSearchV1 } from "../../api/hooks";

export function useTwinClassSchemaSelectAdapter(): SelectAdapter<TwinClassSchema_DETAILED> {
  const { searchTwinClassSchemas } = useTwinClassSchemaSearchV1();

  async function getById(id: string) {
    const response = await searchTwinClassSchemas({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: { idList: [id] },
    });
    return response.data[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTwinClassSchemas({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name }: TwinClassSchema_DETAILED) {
    return name ?? "";
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
