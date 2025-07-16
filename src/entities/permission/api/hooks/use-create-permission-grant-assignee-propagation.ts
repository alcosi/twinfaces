import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { GrantAssigneePropagationPermissionPayload } from "../types";

export const useCreatePermissionGrantAssigneePropagation = () => {
  const api = useContext(PrivateApiContext);

  const createPermissionGrantAssigneePropagation = useCallback(
    async ({ body }: { body: GrantAssigneePropagationPermissionPayload }) => {
      const { error } = await api.permission.grantAssigneePropagationPermission(
        {
          body,
        }
      );

      if (error) {
        throw error;
      }
    },
    [api]
  );

  return { createPermissionGrantAssigneePropagation };
};
