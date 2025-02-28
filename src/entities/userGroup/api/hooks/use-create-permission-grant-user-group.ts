import { useCallback, useContext } from "react";

import { ApiContext } from "@/shared/api";

import { CreatePermissionGrantUserGroupRequestBody } from "../types/permission-grant";

export const useCreatePermissionGrantUserGroup = () => {
  const api = useContext(ApiContext);

  const createPermissionGrantUserGroup = useCallback(
    async ({ body }: { body: CreatePermissionGrantUserGroupRequestBody }) => {
      const { error } = await api.userGroup.createPermissionGrant({ body });

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createPermissionGrantUserGroup };
};
