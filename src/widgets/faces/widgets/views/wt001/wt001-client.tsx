"use client";

import { usePathname, useRouter } from "next/navigation";

import { FaceTC001ViewRs as FaceTC, FaceWT001 } from "@/entities/face";
import { Twin_DETAILED } from "@/entities/twin/server";
import { PlatformArea } from "@/shared/config";

import { TwinsTable } from "../../../../tables";

type WT001ClientProps<T extends FaceTC = FaceTC> = {
  title?: string;
  baseTwinClassId?: string;
  enabledColumns?: FaceWT001["columns"];
  showCreateButton?: boolean;
  isAdmin: boolean;
  modalCreateData?: T;
};

export function WT001Client<T extends FaceTC = FaceTC>({
  title,
  baseTwinClassId,
  enabledColumns,
  showCreateButton,
  isAdmin,
  modalCreateData,
}: WT001ClientProps<T>) {
  const router = useRouter();
  const pathname = usePathname();

  function handleRowClick(row: Twin_DETAILED) {
    const segments = pathname.split("/").filter(Boolean);
    const workspaceIdx = segments.indexOf(PlatformArea.workspace);
    const basePath = workspaceIdx !== -1 ? segments[workspaceIdx + 1] : "";

    const isOnProductsPage =
      segments.length === 3 &&
      segments[0] === PlatformArea.workspace &&
      basePath === "products";

    if (isOnProductsPage) {
      router.push(`/${PlatformArea.browse}/${row.id}`);
    } else {
      router.push(`/${PlatformArea.workspace}/${basePath}/${row.id}`);
    }
  }

  return (
    <TwinsTable
      title={title}
      baseTwinClassId={baseTwinClassId}
      enabledColumns={enabledColumns}
      showCreateButton={showCreateButton}
      resourceNavigationEnabled={isAdmin}
      modalCreateData={modalCreateData}
      onRowClick={handleRowClick}
    />
  );
}
