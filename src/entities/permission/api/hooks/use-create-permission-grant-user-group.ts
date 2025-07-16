import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { GrantUserGroupPermissionPayload } from "../types";

export const useCreatePermissionGrantUserGroup = () => {
  const api = useContext(PrivateApiContext);

  const createPermissionGrantUserGroup = useCallback(
    async ({ body }: { body: GrantUserGroupPermissionPayload }) => {
      const { error } = await api.permission.grantUserGroupPermission({
        body,
      });

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createPermissionGrantUserGroup };
};
