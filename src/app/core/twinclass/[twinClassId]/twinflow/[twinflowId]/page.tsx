import { TwinFlowContextProvider } from "@/features/twin-flow";
import { TwinFlowScreen } from "@/screens/twin-flow";

type Props = {
  params: {
    twinflowId: string;
  };
};

export default function Page({ params: { twinflowId } }: Props) {
  return (
    <TwinFlowContextProvider twinFlowId={twinflowId}>
      <TwinFlowScreen />
    </TwinFlowContextProvider>
  );
}
