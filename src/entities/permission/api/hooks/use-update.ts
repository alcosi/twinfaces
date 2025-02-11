import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { UpdatePermissionRequestBody } from "../types";

// TODO: Apply caching-strategy
export const usePermissionUpdate = () => {
  const api = useContext(ApiContext);

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
