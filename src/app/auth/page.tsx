import { LoginScreen } from "@/screens/login";

type Props = {
  searchParams: Promise<{
    domainId?: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const { domainId } = searchParams;

  return <LoginScreen domainId={domainId!} />;
}
