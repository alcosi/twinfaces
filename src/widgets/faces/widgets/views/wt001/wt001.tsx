import { fetchWT001Face } from "@/entities/face";
import { safe } from "@/shared/libs";

import { AlertError } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT001Client } from "./wt001-client";

export async function WT001({ widget }: WidgetFaceProps) {
  const result = await safe(() => fetchWT001Face(widget.widgetFaceId));

  if (!result.ok) {
    return <AlertError message="Widget WT001 failed to load." />;
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
    />
  );
}
