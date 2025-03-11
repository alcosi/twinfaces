import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { CreatePermissionRequestBody } from "../types";

// TODO: Apply caching-strategy
export const usePermissionCreate = () => {
  const api = useContext(PrivateApiContext);

  const createPermission = useCallback(
    async ({ body }: { body: CreatePermissionRequestBody }) => {
      const { error } = await api.permission.create({ body });

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createPermission };
};
