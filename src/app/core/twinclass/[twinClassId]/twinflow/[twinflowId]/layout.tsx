import { ReactNode } from "react";

import { TwinFlowContextProvider } from "@/features/twin-flow";

type Props = {
  params: {
    twinflowId: string;
  };
  children: ReactNode;
};

export default function Layout({ params: { twinflowId }, children }: Props) {
  return (
    <TwinFlowContextProvider twinFlowId={twinflowId}>
      {children}
    </TwinFlowContextProvider>
  );
}
