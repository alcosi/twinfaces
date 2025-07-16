import { TwinContextProvider } from "@/features/twin";
import { TwinScreen } from "@/screens/twin";

type Props = {
  params: {
    twinId: string;
  };
};

export default function Page({ params: { twinId } }: Props) {
  return (
    <TwinContextProvider twinId={twinId}>
      <TwinScreen />
    </TwinContextProvider>
  );
}
