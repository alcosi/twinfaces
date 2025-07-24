import { TwinStatusContextProvider } from "@/features/twin-status";
import { StatusScreen } from "@/screens/status";

type Props = {
  params: Promise<{
    twinStatusId: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  const { twinStatusId } = params;

  return (
    <TwinStatusContextProvider twinStatusId={twinStatusId}>
      <StatusScreen />
    </TwinStatusContextProvider>
  );
}
