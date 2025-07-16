import { useCallback, useContext, useState } from "react";

import {
  PermissionGroupRqQuery,
  hydratePermissionGroupFromMap,
} from "@/entities/permission-group";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { PermissionGroup_DETAILED } from "../types";

export const useFetchPermissionGroupById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const api = useContext(PrivateApiContext);

  const fetchPermissionGroupById = useCallback(
    async ({
      groupId,
      query,
    }: {
      groupId: string;
      query: PermissionGroupRqQuery;
    }): Promise<PermissionGroup_DETAILED> => {
      setLoading(true);

      try {
        const { data, error } = await api.permissionGroup.getById({
          groupId,
          query,
        });

        if (error) {
          throw new Error(
            "Failed to fetch permission group due to API error",
            error
          );
        }

        if (isUndefined(data?.permissionGroup)) {
          throw new Error(`Permission group with ID ${groupId} not found`);
        }
        const permissionGroup = hydratePermissionGroupFromMap(
          data.permissionGroup,
          data.relatedObjects
        );

        return permissionGroup;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchPermissionGroupById, loading };
};
