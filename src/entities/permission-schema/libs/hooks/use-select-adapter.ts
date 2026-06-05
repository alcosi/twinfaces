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

  async function getItemsPaginated(
    search: string,
    pagination: { pageIndex: number; pageSize: number }
  ) {
    const response = await searchPermissionSchemas({ search, pagination });
    return response.data;
  }

  async function getItems(search: string) {
    return getItemsPaginated(search, { pageIndex: 0, pageSize: 10 });
  }

  function renderItem({ name }: PermissionSchema) {
    return isPopulatedString(name) ? name : "N/A";
  }

  return {
    getById,
    getItems,
    getItemsPaginated,
    renderItem,
  };
}
