import { TwinFlowSchema_DETAILED } from "@/entities/twinFlowSchema";
import { SelectAdapter } from "@/shared/libs";

import { useTwinFlowSchemaSearchV1 } from "../../api/hooks";

export function useTwinFlowSchemaSelectAdapter(): SelectAdapter<TwinFlowSchema_DETAILED> {
  const { searchTwinFlowSchemas } = useTwinFlowSchemaSearchV1();

  async function getById(id: string) {
    // NOTE: Emulating `fetchById` request using `search`
    const response = await searchTwinFlowSchemas({
      pagination: { pageIndex: 0, pageSize: 1 },
      filters: { idList: [id] },
    });
    return response.data[0];
  }

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchTwinFlowSchemas({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name }: TwinFlowSchema_DETAILED) {
    return name;
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
