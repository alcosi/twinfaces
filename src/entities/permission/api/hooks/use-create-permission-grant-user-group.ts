import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { CreatePermissionGrantUserGroupRequestBody } from "../types";

export const useCreatePermissionGrantUserGroup = () => {
  const api = useContext(PrivateApiContext);

  const createPermissionGrantUserGroup = useCallback(
    async ({ body }: { body: CreatePermissionGrantUserGroupRequestBody }) => {
      const { error } = await api.permission.createPermissionGrantUserGroup({
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
