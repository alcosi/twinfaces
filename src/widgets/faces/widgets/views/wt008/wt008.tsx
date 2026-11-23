import { fetchWT008Face } from "@/entities/face";
import { withRedirectOnUnauthorized } from "@/features/auth";
import { cn, isFalsy, safe } from "@/shared/libs";

import { StatusAlert } from "../../../components";
import { WidgetFaceProps } from "../../types";
import { WT008Client } from "./wt008-client";

/**
 * WT008 — comments of a twin as a list of cards.
 *
 * Comments come from the backend-configured comment search
 * (`twinCommentSearchId`); the twin the widget points to is passed to it as the
 * `twinId` search param, the same way configured twin searches receive theirs.
 */
export async function WT008({ twinId, widget, className }: WidgetFaceProps) {
  const result = await safe(
    withRedirectOnUnauthorized(() =>
      fetchWT008Face(widget.widgetFaceId, twinId)
    )
  );

  if (!result.ok || !result.data.widget) {
    return (
      <StatusAlert variant="error" message="Widget WT008 failed to load." />
    );
  }

  const { id, label, pointedTwinId, twinCommentSearchId, styleClasses } =
    result.data.widget;

  if (isFalsy(twinCommentSearchId)) {
    return (
      <StatusAlert
        variant="warn"
        title="Widget WT008 is not configured"
        message="The widget has no comment search configured."
      />
    );
  }

  return (
    <div data-face-id={id} className={cn(className, styleClasses)}>
      <WT008Client
        title={label || "Comments"}
        searchId={twinCommentSearchId}
        twinId={pointedTwinId ?? twinId}
      />
    </div>
  );
}
