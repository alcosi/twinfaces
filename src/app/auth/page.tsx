import { LoginScreen } from "@/screens/login";

//NOTE: Successfully tested and Next.js removes caching automatically and no need to revalidate
export const revalidate = 0;

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
