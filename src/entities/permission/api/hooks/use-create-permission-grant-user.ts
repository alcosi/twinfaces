import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { GrantUserPermissionPayload } from "../types";

export const useCreatePermissionGrantUser = () => {
  const api = useContext(PrivateApiContext);

  const createPermissionGrantUser = useCallback(
    async ({ body }: { body: GrantUserPermissionPayload }) => {
      const { error } = await api.permission.grantUserPermission({
        body,
      });

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createPermissionGrantUser };
};
