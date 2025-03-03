import { useCallback, useContext } from "react";

import { ApiContext } from "@/shared/api";

import { CreatePermissionGrantUserRequestBody } from "../types";

export const useCreatePermissionGrantUser = () => {
  const api = useContext(ApiContext);

  const createPermissionGrantUser = useCallback(
    async ({ body }: { body: CreatePermissionGrantUserRequestBody }) => {
      const { error } = await api.permission.createPermissionGrantUser({
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
