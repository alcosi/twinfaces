import { useContext } from "react";

import { TwinContext } from "@/features/twin";
import { AttachmentsTable } from "@/widgets/tables";

export function TwinAttachments() {
  const { twinId } = useContext(TwinContext);

  const showColumns = [
    "id",
    "externalId",
    "title",
    "description",
    "twinClassFieldId",
    "twinflowTransitionId",
    "commentId",
    "viewPermissionId",
    "authorUserId",
    "createdAt",
  ];

  return <AttachmentsTable baseTwinId={twinId} enabledColumns={showColumns} />;
}
