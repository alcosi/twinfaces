import { ReactNode } from "react";

import { RecipientCollectorContextProvider } from "@/features/recipient-collectors";

type RecipientCollectorsLayoutProps = {
  params: Promise<{
    collectorId: string;
  }>;
  children: ReactNode;
};

export default async function RecipientCollectorsLayout(
  props: RecipientCollectorsLayoutProps
) {
  const params = await props.params;
  const { collectorId } = params;
  const { children } = props;

  return (
    <RecipientCollectorContextProvider collectorId={collectorId}>
      {children}
    </RecipientCollectorContextProvider>
  );
}
