"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useMemo } from "react";

import {
  PermissionAction,
  getCoreRouteSegment,
  getPermissionKeysForSegmentAction,
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

// Overrides the route segment used to resolve permission prefixes for the
// subtree. Needed when a table/feature is rendered outside its own route (e.g.
// embedded as a tab in another entity's page), where the pathname would
// otherwise resolve the wrong permission prefix.
const PermissionScopeContext = createContext<string | undefined>(undefined);

export function PermissionScopeProvider({
  segment,
  children,
}: {
  segment?: string;
  children: React.ReactNode;
}) {
  const parent = useContext(PermissionScopeContext);
  // When no segment is provided, keep the parent scope instead of clearing it.
  return (
    <PermissionScopeContext.Provider value={segment ?? parent}>
      {children}
    </PermissionScopeContext.Provider>
  );
}

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
  const scopeSegment = useContext(PermissionScopeContext);
  const context = useContext(PermissionsAccessContext);

  const canForCurrentRoute = (
    action: PermissionAction,
    options?: { segment?: string }
  ): boolean => {
    // Resolve order: explicit segment → scope from context → current pathname.
    const segment =
      options?.segment ?? scopeSegment ?? getCoreRouteSegment(pathname);
    const actionKeys = getPermissionKeysForSegmentAction({ segment, action });
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
