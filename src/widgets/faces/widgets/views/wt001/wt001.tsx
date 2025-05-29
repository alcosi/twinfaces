import { fetchWT001Face, getAuthHeaders } from "@/entities/face";
import { KEY_TO_ID_PERMISSION_MAP } from "@/entities/permission/server";
import { isGranted } from "@/entities/user/server";
import { safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT001Client } from "./wt001-client";

export async function WT001({ widget }: WidgetFaceProps) {
  const { currentUserId } = await getAuthHeaders();
  const isAdmin = await isGranted({
    userId: currentUserId,
    permission: KEY_TO_ID_PERMISSION_MAP.DOMAIN_MANAGE,
  });

  const result = await safe(() => fetchWT001Face(widget.widgetFaceId));

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
