"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import {
  PermissionGroup_DETAILED,
  useFetchPermissionGroupById,
} from "@/entities/permission-group";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type PermissionGroupContextProps = {
  groupId: string;
  permissionGroup: PermissionGroup_DETAILED;
  refresh: () => Promise<void>;
};

export const PermissionGroupContext =
  createContext<PermissionGroupContextProps>({} as PermissionGroupContextProps);

export function PermissionGroupContextProvider({
  groupId,
  children,
}: {
  groupId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [groupId]);

  const [permissionGroup, setPermissionGroup] = useState<
    PermissionGroup_DETAILED | undefined
  >(undefined);
  const { fetchPermissionGroupById, loading } = useFetchPermissionGroupById();

  async function refresh() {
    try {
      const response = await fetchPermissionGroupById({
        groupId,
        query: {
          showPermissionGroup2TwinClassMode: "DETAILED",
          showPermissionGroupMode: "DETAILED",
        },
      });

      if (response) {
        setPermissionGroup(response);
      }
    } catch (error) {
      console.error("Failed to fetch permission group:", error);
    }
  }

  if (isUndefined(permissionGroup) || loading) return <LoadingOverlay />;

  return (
    <PermissionGroupContext.Provider
      value={{ groupId, permissionGroup, refresh }}
    >
      {children}
    </PermissionGroupContext.Provider>
  );
}
