import { use } from "react";

import { FactoryTriggerContextProvider } from "@/features/factory-trigger";
import { FactoryTriggerScreen } from "@/screens/factory-trigger";

type Props = {
  params: Promise<{
    factoryTriggerId: string;
  }>;
};

export default function Page({ params }: Props) {
  const { factoryTriggerId } = use(params);

  return (
    <FactoryTriggerContextProvider factoryTriggerId={factoryTriggerId}>
      <FactoryTriggerScreen />
    </FactoryTriggerContextProvider>
  );
}
