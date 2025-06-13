import { fetchWT001Face } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isAuthUserGranted } from "@/entities/user/server";
import { safeWithRedirect } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT001Client } from "./wt001-client";

export async function WT001({ widget, twinId }: WidgetFaceProps) {
  const isAdmin = await isAuthUserGranted({
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  const result = await safeWithRedirect(() =>
    fetchWT001Face(widget.widgetFaceId, twinId)
  );

  if (!result.ok) {
    return (
      <StatusAlert variant="error" message="Widget WT001 failed to load." />
    );
  }

  const { label, twinClassId, columns, showCreateButton } = result.data;
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
    />
  );
}
