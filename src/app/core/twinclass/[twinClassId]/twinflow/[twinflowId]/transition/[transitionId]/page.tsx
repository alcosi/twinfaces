import { TransitionScreen, TransitionScreenParams } from "@/screens/transition";

type Props = {
  params: TransitionScreenParams;
};

export default function TransitionPage({ params }: Props) {
  return <TransitionScreen {...params} />;
}
