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

  async function getItems(search: string) {
    const response = await searchTwinClassSchemas({ search });
    return response.data;
  }

  function renderItem({ name }: TwinClassSchema_DETAILED) {
    return name ?? "";
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
