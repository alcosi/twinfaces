import { useCallback, useContext } from "react";

import { ApiContext } from "@/shared/api";

import { CreatePermissionGrantTwinRoleRequestBody } from "../types";

export const useCreatePermissionGrantTwinRole = () => {
  const api = useContext(ApiContext);

  const createPermissionGrantTwinRole = useCallback(
    async ({ body }: { body: CreatePermissionGrantTwinRoleRequestBody }) => {
      const { error } = await api.permission.createPermissionGrantTwinRole({
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
