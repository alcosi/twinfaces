import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { GrantTwinRolePermissionPayload } from "../types";

export const useCreatePermissionGrantTwinRole = () => {
  const api = useContext(PrivateApiContext);

  const createPermissionGrantTwinRole = useCallback(
    async ({ body }: { body: GrantTwinRolePermissionPayload }) => {
      const { error } = await api.permission.grantTwinRolePermission({
        body,
      });

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createPermissionGrantTwinRole };
};
