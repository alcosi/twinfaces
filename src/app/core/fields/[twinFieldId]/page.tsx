import { Suspense } from "react";

import { fetchTwinClassFieldById } from "@/entities/twin-class-field/server";
import { LoadingScreen } from "@/screens/loading";
import { TwinClassFieldScreen } from "@/screens/twin-class-field";

type Props = {
  params: {
    twinFieldId: string;
  };
};

export default async function Page({ params: { twinFieldId } }: Props) {
  const twinField = await fetchTwinClassFieldById(twinFieldId);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <TwinClassFieldScreen twinFieldId={twinFieldId} twinField={twinField} />
    </Suspense>
  );
}
