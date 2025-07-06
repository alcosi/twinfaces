import {
  FaceTC001ViewRs as FaceTC,
  FaceWT001,
  fetchTC001Face,
  fetchWT001Face,
} from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isAuthUserGranted } from "@/entities/user/server";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { RelatedObjects } from "@/shared/api";
import { isTruthy, isUndefined, safe } from "@/shared/libs";

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

  const {
    widget: { label, twinClassId, columns, showCreateButton, modalFaceId },
    relatedObjects,
  } = wtResult.data as {
    widget: FaceWT001;
    relatedObjects?: RelatedObjects;
  };

  let modalCreateData: FaceTC | undefined = undefined;

  if (isTruthy(modalFaceId)) {
    const modalFace = relatedObjects?.faceMap?.[modalFaceId];

    const fetcher = componentToFetcherMap[`${modalFace?.component}`];

    if (isUndefined(fetcher)) {
      console.error(`No fetcher mapped for component: ${modalFace?.component}`);
      return;
    }

    const modalFaceResult = await safe(
      withRedirectOnUnauthorized(() => fetcher(modalFaceId, twinId!))
    );

    if (!modalFaceResult.ok) {
      console.error(
        `Failed to load modal face data for component ${modalFace?.component}:`,
        modalFaceResult.error
      );
      return;
    }

    modalCreateData = modalFaceResult.data;
  }

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
      modalCreateData={modalCreateData}
    />
  );
}
