import { LoadingOverlay } from "@/shared/ui/loading";
import {
  Permission_DETAILED,
  useFetchPermissionById,
} from "@/entities/permission";
import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { isUndefined } from "@/shared/libs";

type Context = {
  permissionId: string;
  permission: Permission_DETAILED;
  refresh: () => void;
};

export type PermissionLayoutProps = PropsWithChildren<{
  params: Pick<Context, "permissionId">;
}>;

export const PermissionContext = createContext<Context>({} as Context);

export function PermissionContextProvider({
  params: { permissionId },
  children,
}: PermissionLayoutProps) {
  const [permission, setPermission] = useState<Permission_DETAILED | undefined>(
    undefined
  );
  const { fetchPermissionById, loading } = useFetchPermissionById();

  useEffect(() => {
    refresh();
  }, [permissionId]);

  async function refresh() {
    const response = await fetchPermissionById({
      permissionId,
      query: {
        lazyRelation: false,
        showPermission2PermissionGroupMode: "DETAILED",
        showPermissionMode: "DETAILED",
      },
    });
    setPermission(response);
  }

  if (isUndefined(permission)) return <>{loading && <LoadingOverlay />}</>;

  return (
    <PermissionContext.Provider value={{ permissionId, permission, refresh }}>
      {loading && <LoadingOverlay />}
      {!loading && children}
    </PermissionContext.Provider>
  );
}
