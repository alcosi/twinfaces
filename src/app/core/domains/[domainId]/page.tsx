import { use } from "react";

import { DomainContextProvider } from "@/features/domain";
import { DomainScreen } from "@/screens/domain";

type Props = {
  params: Promise<{ domainId: string }>;
};

export default function Page({ params }: Props) {
  const { domainId } = use(params);

  return (
    <DomainContextProvider domainId={domainId}>
      <DomainScreen />
    </DomainContextProvider>
  );
}
