"use client";

import { ReactNode, use } from "react";

import { RecipientCollectorContextProvider } from "@/features/recipient-collectors";

type RecipientCollectorsLayoutProps = {
  params: Promise<{
    collectorId: string;
  }>;
  children: ReactNode;
};

export default function RecipientCollectorsLayout(
  props: RecipientCollectorsLayoutProps
) {
  const params = use(props.params);

  const { collectorId } = params;

  const { children } = props;

  return (
    <RecipientCollectorContextProvider collectorId={collectorId}>
      {children}
    </RecipientCollectorContextProvider>
  );
}
