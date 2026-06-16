import { useContext } from "react";

import { TwinContext } from "@/features/twin";
import { CommentsTable } from "@/widgets/tables";

export function TwinComments() {
  const { twinId } = useContext(TwinContext);

  return <CommentsTable baseTwinId={twinId} />;
}
