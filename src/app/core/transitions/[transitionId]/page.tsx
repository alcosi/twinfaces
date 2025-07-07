import { TwinFlowTransitionContextProvider } from "@/features/twin-flow-transition";
import { TransitionScreen } from "@/screens/transition";

type Props = {
  params: {
    transitionId: string;
  };
};

export default function TwinFlowTransitionLayout({
  params: { transitionId },
}: Props) {
  return (
    <TwinFlowTransitionContextProvider transitionId={transitionId}>
      <TransitionScreen />
    </TwinFlowTransitionContextProvider>
  );
}
