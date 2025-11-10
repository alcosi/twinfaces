import { DomainContextProvider } from "@/features/domain";
import { DomainScreen } from "@/screens/domain";

type Props = {
  params: {
    domainId: string;
  };
};

export default async function Page({ params: { domainId } }: Props) {
  return (
    <DomainContextProvider domainId={domainId}>
      <DomainScreen />
    </DomainContextProvider>
  );
}
