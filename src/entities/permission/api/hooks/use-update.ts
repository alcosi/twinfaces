import { useCallback, useContext } from "react";

import { PrivateApiContext } from "@/shared/api";

import { UpdatePermissionRequestBody } from "../types";

export const usePermissionUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updatePermission = useCallback(
    async ({
      permissionId,
      body,
    }: {
      permissionId: string;
      body: UpdatePermissionRequestBody;
    }) => {
      return await api.permission.update({ permissionId, body });
    },
    [api]
  );

  return { updatePermission };
};
