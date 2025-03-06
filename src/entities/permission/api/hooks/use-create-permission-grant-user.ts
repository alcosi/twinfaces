import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { CreatePermissionGrantUserRequestBody } from "../types";

export const useCreatePermissionGrantUser = () => {
  const api = useContext(PrivateApiContext);

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
