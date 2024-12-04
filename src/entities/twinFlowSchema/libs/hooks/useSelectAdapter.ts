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

  async function getItems(search: string) {
    const response = await searchTwinFlowSchemas({ search });
    return response.data;
  }

  function renderItem({ name }: TwinFlowSchema_DETAILED) {
    return name;
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
