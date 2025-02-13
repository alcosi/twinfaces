import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext, useState } from "react";
import {
  hydratePermissionSchemaFromMap,
  PermissionSchema,
  PermissionSchemaRqQuery,
} from "@/entities/permission-schema";

// TODO: Apply caching-strategy after discussing with team
export const useFetchPermissionSchemaById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const api = useContext(ApiContext);

  const fetchPermissionSchemaById = useCallback(
    async ({
      schemaId,
      query,
    }: {
      schemaId: string;
      query: PermissionSchemaRqQuery;
    }): Promise<PermissionSchema> => {
      setLoading(true);

      try {
        const { data, error } = await api.permissionSchema.getById({
          schemaId,
          query,
        });

        if (error) {
          throw new Error(
            "Failed to fetch permission schema due to API error",
            error
          );
        }

        if (isUndefined(data?.permissionSchema)) {
          throw new Error(
            "Response does not have permission schema data",
            error
          );
        }

        const permissionSchema = hydratePermissionSchemaFromMap(
          data.permissionSchema,
          data.relatedObjects
        );

        return permissionSchema;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchPermissionSchemaById, loading };
};
