import { fetchWT008Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { isFalsy, safe } from "@/shared/libs";

import { CommentsTable } from "../../../../tables/comments";
import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";

export async function WT008({ twinId, widget }: WidgetFaceProps) {
  if (isFalsy(twinId)) {
    return (
      <StatusAlert
        title="Missing twinId"
        message="Component WT008 requires twinId but was not provided."
      />
    );
  }

  // The widget config only carries presentation hints (title, chart toggle).
  // If it fails to load, degrade to the default table instead of blocking the
  // whole tab — the data source (comment search filtered by twinId) is the same.
  const result = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT008Face(widget.widgetFaceId, twinId)
    )
  );
  const config = result.ok ? result.data.widget : undefined;

  return (
    <CommentsTable
      title={config?.label || "Comments"}
      baseTwinId={twinId}
      showChart={config?.showChart ?? true}
    />
  );
}
