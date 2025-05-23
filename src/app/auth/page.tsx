import { Login } from "@/screens/login";

type Props = {
  searchParams: {
    domainId?: string;
  };
};

export default function Page({ searchParams }: Props) {
  const { domainId } = searchParams;

  return <Login domainId={domainId!} />;
}
