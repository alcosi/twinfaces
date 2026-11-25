import { TwinPageRenderer } from "@/widgets/faces/layouts";

type Props = {
  params: Promise<{
    twinId: string;
  }>;
};

export default async function Page(props: Props) {
  const { twinId } = await props.params;

  return <TwinPageRenderer twinId={twinId} />;
}
