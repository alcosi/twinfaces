import { useCallback, useContext } from "react";

import { ApiContext } from "@/shared/api";

import { CreatePermissionGrantUserGroupRequestBody } from "../types";

export const useCreatePermissionGrantUserGroup = () => {
  const api = useContext(ApiContext);

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
