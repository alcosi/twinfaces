import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { CreatePermissionRequestBody } from "../types";

// TODO: Apply caching-strategy
export const usePermissionCreate = () => {
  const api = useContext(ApiContext);

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
