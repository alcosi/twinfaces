import { use } from "react";

import { TwinFlowFactoryContextProvider } from "@/features/twinflow-factory";
import { TwinFlowFactoryScreen } from "@/screens/twinflow-factory";

type Props = {
  params: Promise<{ factoriesId: string }>;
};

export default function Page({ params }: Props) {
  const { factoriesId } = use(params);
  return (
    <TwinFlowFactoryContextProvider twinflowFactoryId={factoriesId}>
      <TwinFlowFactoryScreen />
    </TwinFlowFactoryContextProvider>
  );
}
