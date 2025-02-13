import { isPopulatedString, SelectAdapter } from "@/shared/libs";
import { PermissionSchema, usePermissionSchemaSearchV1 } from "../../api";

export function usePermissionSchemaSelectAdapter(): SelectAdapter<PermissionSchema> {
  const { searchPermissionSchemas } = usePermissionSchemaSearchV1();

  async function getById(id: string) {
    return {};
  }

  async function getItems(search: string) {
    const response = await searchPermissionSchemas({ search });
    return response.data;
  }

  function renderItem({ name }: PermissionSchema) {
    return isPopulatedString(name) ? name : "N/A";
  }

  return {
    getById,
    getItems,
    renderItem,
  };
}
