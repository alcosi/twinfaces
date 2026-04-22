import { ReactNode, use } from "react";

import { FactoryTriggerContextProvider } from "@/features/factory-trigger";

type FactoryTriggerLayoutProps = {
  params: Promise<{
    factoryTriggerId: string;
  }>;
  children: ReactNode;
};

export default function FactoryTriggerLayout(props: FactoryTriggerLayoutProps) {
  const params = use(props.params);

  const { factoryTriggerId } = params;

  const { children } = props;

  return (
    <FactoryTriggerContextProvider factoryTriggerId={factoryTriggerId}>
      {children}
    </FactoryTriggerContextProvider>
  );
}
