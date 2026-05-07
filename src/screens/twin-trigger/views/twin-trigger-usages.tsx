import { useContext } from "react";

import { TwinTriggerContext } from "@/features/twin-trigger";
import { FactoryTriggersTable, StatusTriggersTable } from "@/widgets/tables";
import { TransitionTriggersTable } from "@/widgets/tables/transition-triggers";

export function TwinTriggerUsages() {
  const { twinTriggerId } = useContext(TwinTriggerContext);

  return (
    <>
      <StatusTriggersTable twinTriggerId={twinTriggerId} />

      <FactoryTriggersTable twinTriggerId={twinTriggerId} />

      <TransitionTriggersTable twinTriggerId={twinTriggerId} />
    </>
  );
}
