import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { PermissionUpdate } from "../types";

export const usePermissionUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updatePermission = useCallback(
    async ({
      permissionId,
      body,
    }: {
      permissionId: string;
      body: Omit<PermissionUpdate, "id">;
    }) => {
      return await api.permission.update({
        body: { permissions: [{ id: permissionId, ...body }] },
      });
    },
    [api]
  );

  return { updatePermission };
};
