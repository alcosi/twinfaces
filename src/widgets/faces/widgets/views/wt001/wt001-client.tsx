"use client";

import { FaceTC001ViewRs as FaceTC, FaceWT001 } from "@/entities/face";

import { TwinsTable } from "../../../../tables";

type WT001ClientProps<T extends FaceTC = FaceTC> = {
  title?: string;
  baseTwinClassId?: string;
  enabledColumns?: FaceWT001["columns"];
  showCreateButton?: boolean;
  isAdmin: boolean;
  modalCreateData?: T;
  searchId?: string;
  searchParams?: {
    [key: string]: string;
  };
};

export function WT001Client<T extends FaceTC = FaceTC>({
  title,
  baseTwinClassId,
  enabledColumns,
  showCreateButton,
  isAdmin,
  modalCreateData,
  searchId,
  searchParams,
}: WT001ClientProps<T>) {
  return (
    <TwinsTable
      title={title}
      baseTwinClassId={baseTwinClassId}
      enabledColumns={enabledColumns}
      showCreateButton={showCreateButton}
      resourceNavigationEnabled={isAdmin}
      modalCreateData={modalCreateData}
      searchId={searchId}
      searchParams={searchParams}
    />
  );
}
