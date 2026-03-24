"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

import {
  PermissionAction,
  getPermissionKeysForCoreRouteAction,
  hasAnyPermissionKey,
} from "../utils";

type PermissionsAccessContextValue = {
  permissionKeys: Set<string>;
  hasPermissionKey: (permissionKey: string) => boolean;
};

const PermissionsAccessContext = createContext<PermissionsAccessContextValue>({
  permissionKeys: new Set<string>(),
  hasPermissionKey: () => true,
});

export function PermissionsAccessProvider({
  children,
  permissionKeys,
}: {
  children: React.ReactNode;
  permissionKeys: string[];
}) {
  const permissionSet = useMemo(
    () => new Set(permissionKeys),
    [permissionKeys]
  );

  const value = useMemo<PermissionsAccessContextValue>(
    () => ({
      permissionKeys: permissionSet,
      hasPermissionKey: (permissionKey) => permissionSet.has(permissionKey),
    }),
    [permissionSet]
  );

  return (
    <PermissionsAccessContext.Provider value={value}>
      {children}
    </PermissionsAccessContext.Provider>
  );
}

export function usePermissionsAccess() {
  const pathname = usePathname() || "";
  const context = useContext(PermissionsAccessContext);

  const canForCurrentRoute = (action: PermissionAction): boolean => {
    const actionKeys = getPermissionKeysForCoreRouteAction({
      pathname,
      action,
    });
    if (actionKeys.length === 0) return true;
    return hasAnyPermissionKey({
      permissionKeys: context.permissionKeys,
      keysToCheck: actionKeys,
    });
  };

  return {
    ...context,
    canForCurrentRoute,
  };
}
