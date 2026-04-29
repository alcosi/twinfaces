import { useContext } from "react";

import { TwinContext } from "@/features/twin";
import { TriggerTasksTable } from "@/widgets/tables";

export function TwinTriggerTasks() {
  const { twinId } = useContext(TwinContext);
  return <TriggerTasksTable twinId={twinId} />;
}
