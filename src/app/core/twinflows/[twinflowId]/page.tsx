import { use } from "react";

import { TwinFlowContextProvider } from "@/features/twin-flow";
import { TwinFlowScreen } from "@/screens/twin-flow";

type Props = {
  params: Promise<{ twinflowId: string }>;
};

export default function Page({ params }: Props) {
  const { twinflowId } = use(params);

  return (
    <TwinFlowContextProvider twinFlowId={twinflowId}>
      <TwinFlowScreen />
    </TwinFlowContextProvider>
  );
}
