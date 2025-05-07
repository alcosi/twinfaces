import { useContext } from "react";

import { TwinContext } from "@/features/twin";
import { AttachmentsTable } from "@/widgets/tables";

export function TwinAttachments() {
  const { twinId } = useContext(TwinContext);

  return <AttachmentsTable baseTwinId={twinId} />;
}
