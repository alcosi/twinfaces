import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isEmptyArray, isUndefined } from "@/shared/libs";

import { hydrateSpaceRoleFromMap } from "../../libs";
import { SpaceRole_DETAILED } from "../types";

export function useFetchSpaceRoleById() {
  const api = useContext(PrivateApiContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const fetchSpaceRoleById = useCallback(
    async (id: string): Promise<SpaceRole_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { data, error } = await api.spaceRole.search({
          pagination: { pageIndex: 0, pageSize: 1 },
          filters: { idList: [id] },
        });

        if (error) {
          throw error;
        }

        if (isUndefined(data.spaceRoles) || isEmptyArray(data.spaceRoles)) {
          throw new Error(`Space roles with ID ${id} not found.`);
        }

        if (data.relatedObjects) {
          return hydrateSpaceRoleFromMap(
            data.spaceRoles[0]!,
            data.relatedObjects
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchSpaceRoleById, isLoading };
}
