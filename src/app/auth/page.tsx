import { LoginScreen } from "@/screens/login";

type Props = {
  searchParams: {
    domainId?: string;
  };
};

export default function Page({ searchParams }: Props) {
  const { domainId } = searchParams;

  return <LoginScreen domainId={domainId!} />;
}
