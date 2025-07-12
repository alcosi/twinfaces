import { fetchTwinClassFieldById } from "@/entities/twin-class-field/server";
import { TwinClassFieldScreen } from "@/screens/twin-class-field";

type Props = {
  params: {
    twinFieldId: string;
  };
};

export default async function Page({ params: { twinFieldId } }: Props) {
  const twinField = await fetchTwinClassFieldById(twinFieldId);

  return (
    <TwinClassFieldScreen twinFieldId={twinFieldId} twinField={twinField} />
  );
}
