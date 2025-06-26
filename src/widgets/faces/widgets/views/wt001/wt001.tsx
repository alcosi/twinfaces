import {
  FaceTC,
  FaceWT001,
  fetchTC001Face,
  fetchWT001Face,
} from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isAuthUserGranted } from "@/entities/user/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isFalsy, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT001Client } from "./wt001-client";

const componentToFetcherMap: Record<
  string,
  (modalFaceId: string, twinId: string) => Promise<FaceTC>
> = {
  TC001: fetchTC001Face,
};

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

  const { label, twinClassId, columns, showCreateButton, modalFaceId } =
    wtResult.data.widget as FaceWT001;
  const faceMap = wtResult.data.relatedObjects?.faceMap ?? {};

  let modalCreateData = null;

  if (isFalsy(modalFaceId)) return;

  const modalFace = faceMap[modalFaceId];

  if (!modalFace?.component) {
    console.error(`Face not found in faceMap for modalFaceId: ${modalFaceId}`);
    return;
  }

  const fetcher = componentToFetcherMap[modalFace.component];

  if (!fetcher) {
    console.error(`No fetcher mapped for component: ${modalFace.component}`);
    return;
  }

  const result = await safe(() => fetcher(modalFaceId, twinId!));

  if (!result.ok) {
    console.error(
      `Failed to load modal face data for component ${modalFace.component}:`,
      result.error
    );
    return;
  }

  modalCreateData = result.data;

  const sortedEnabledColumns = Array.isArray(columns)
    ? [...columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return (
    <WT001Client
      title={label}
      baseTwinClassId={twinClassId}
      enabledColumns={sortedEnabledColumns}
      showCreateButton={showCreateButton}
      isAdmin={isAdmin}
      modalCreateData={modalCreateData!}
    />
  );
}
