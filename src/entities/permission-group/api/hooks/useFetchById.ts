import { useCallback } from "react";

import { isUndefined } from "@/shared/libs";

import { PermissionGroup_DETAILED } from "../types";
import { usePermissionGroupSearchV1 } from "./useSearchV1";

export const useFetchPermissionGroupById = () => {
  const { searchPermissionGroups } = usePermissionGroupSearchV1();

  const fetchPermissionGroupById = useCallback(
    async (id: string): Promise<PermissionGroup_DETAILED> => {
      const { data } = await searchPermissionGroups({
        filters: {
          idList: [id],
        },
      });

      if (isUndefined(data[0])) {
        throw new Error(`Permission group with ID ${id} not found`);
      }

      return data[0];
    },
    [searchPermissionGroups]
  );

  return { fetchPermissionGroupById };
};
