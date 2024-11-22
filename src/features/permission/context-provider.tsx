import { LoadingOverlay } from "@/shared/ui/loading";
import {
  Permission,
  Permission_DETAILED,
  usePermissionSearchV1,
} from "@/entities/permission";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

type Context = {
  permissionId: string;
  permission?: Permission_DETAILED;
};

export type PermissionLayoutProps = PropsWithChildren<{
  params: Pick<Context, "permissionId">;
}>;

export const PermissionContext = createContext<Context>({} as Context);

export function PermissionContextProvider({
  params: { permissionId },
  children,
}: PermissionLayoutProps) {
  const { searchPermissions } = usePermissionSearchV1();
  const [loading, setLoading] = useState<boolean>(false);
  const [permission, setPermission] = useState<Permission_DETAILED | undefined>(
    undefined
  );

  useEffect(() => {
    fetchData();
  }, [permissionId]);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await searchPermissions({
        pagination: {
          pageIndex: 0,
          pageSize: 1,
        },
        filters: {
          idList: [permissionId],
        },
      });
      const permissions = response.data ?? [];
      setPermission(permissions[0]);
    } catch (e) {
      console.error("Failed to fetch permissions", e);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return (
    <PermissionContext.Provider value={{ permissionId, permission }}>
      {loading && <LoadingOverlay />}
      {!loading && children}
    </PermissionContext.Provider>
  );
}
