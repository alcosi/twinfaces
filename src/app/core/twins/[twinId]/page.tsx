import { TwinContextProvider } from "@/features/twin";
import { TwinScreen } from "@/screens/twin";

type Props = {
  params: Promise<{
    twinId: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  const { twinId } = params;

  return (
    <TwinContextProvider twinId={twinId}>
      <TwinScreen />
    </TwinContextProvider>
  );
}
