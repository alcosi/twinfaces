import { Suspense } from "react";

import { FaceWT001, fetchWT001Face } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isAuthUserGranted } from "@/entities/user/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { TableSkeleton } from "@/features/ui/skeletons";
import { RelatedObjects } from "@/shared/api";
import { isTruthy, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { fetchModalCreateData } from "../tc001/fetch-modal-create-data";
import { WT001Client } from "./wt001-client";

export async function WT001({ widget, twinId }: WidgetFaceProps) {
  const isAdmin = await isAuthUserGranted({
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  const wtResult = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT001Face(widget.widgetFaceId, twinId)
    )
  );

  if (!wtResult.ok) {
    return (
      <StatusAlert variant="error" message="Widget WT001 failed to load." />
    );
  }

  const {
    widget: { label, twinClassId, columns, showCreateButton, modalFaceId },
    relatedObjects,
  } = wtResult.data as {
    widget: FaceWT001;
    relatedObjects?: RelatedObjects;
  };

  const modalFace = relatedObjects?.faceMap?.[modalFaceId!];
  const modalCreateData = isTruthy(modalFaceId)
    ? await fetchModalCreateData(modalFace!, twinId!)
    : undefined;

  const sortedEnabledColumns = Array.isArray(columns)
    ? [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return (
    <Suspense fallback={<TableSkeleton />}>
      <WT001Client
        title={label}
        baseTwinClassId={twinClassId}
        enabledColumns={sortedEnabledColumns}
        showCreateButton={showCreateButton}
        isAdmin={isAdmin}
        modalCreateData={modalCreateData}
      />
    </Suspense>
  );
}
