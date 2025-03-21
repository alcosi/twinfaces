import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { GrantSpaceRolePermissionPayload } from "../types";

export const useCreatePermissionGrantSpaceRole = () => {
  const api = useContext(PrivateApiContext);

  const createPermissionGrantSpaceRole = useCallback(
    async ({ body }: { body: GrantSpaceRolePermissionPayload }) => {
      const { error } = await api.permission.grantSpaceRolePermission({
        body,
      });

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createPermissionGrantSpaceRole };
};
