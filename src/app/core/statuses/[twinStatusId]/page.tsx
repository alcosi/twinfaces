import { fetchTwinClassStatusById } from "@/entities/twin-status/server";
import { TwinStatusContextProvider } from "@/features/twin-status";
import { StatusScreen } from "@/screens/status";

type Props = {
  params: Promise<{ twinStatusId: string }>;
};

export default async function Page({ params }: Props) {
  const { twinStatusId } = await params;

  const twinStatus = await fetchTwinClassStatusById(twinStatusId);

  return (
    <TwinStatusContextProvider twinStatusId={twinStatusId}>
      <StatusScreen twinStatus={twinStatus} />
    </TwinStatusContextProvider>
  );
}
