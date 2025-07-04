import { TwinContextProvider } from "@/features/twin";
import { TwinScreen } from "@/screens/twin";

type Props = {
  params: {
    twinId: string;
  };
};

export default function Page({ params: { twinId } }: Props) {
  console.log("Page twins/[twinId] rendered", twinId);
  return (
    <TwinContextProvider twinId={twinId}>
      <TwinScreen />
    </TwinContextProvider>
  );
}
