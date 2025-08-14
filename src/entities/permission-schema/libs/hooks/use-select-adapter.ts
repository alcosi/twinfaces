import { SelectAdapter, isPopulatedString } from "@/shared/libs";

import {
  PermissionSchema,
  useFetchPermissionSchemaById,
  usePermissionSchemaSearchV1,
} from "../../api";

export function usePermissionSchemaSelectAdapter(): SelectAdapter<PermissionSchema> {
  const { searchPermissionSchemas } = usePermissionSchemaSearchV1();
  const { fetchPermissionSchemaById } = useFetchPermissionSchemaById();

  async function getById(id: string) {
    return fetchPermissionSchemaById({
      schemaId: id,
      query: {
        lazyRelation: false,
        showPermissionSchemaMode: "DETAILED",
      },
    });
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
