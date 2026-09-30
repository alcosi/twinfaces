import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { PermissionCreate } from "../types";

export const usePermissionCreate = () => {
  const api = useContext(PrivateApiContext);

  const createPermission = useCallback(
    async ({ body }: { body: PermissionCreate }) => {
      const { data, error } = await api.permission.create({
        body: { permissions: [body] },
      });

      if (error) {
        throw error;
      }

      return data?.permissions?.[0]?.id;
    },
    [api]
  );

  return { createPermission };
};
