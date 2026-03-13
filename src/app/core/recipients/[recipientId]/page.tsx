import { RecipientContextProvider } from "@/features/recipient";
import { RecipientScreen } from "@/screens/recipient";

type Props = {
  params: Promise<{
    recipientId: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const { recipientId } = params;

  return (
    <RecipientContextProvider recipientId={recipientId}>
      <RecipientScreen />
    </RecipientContextProvider>
  );
}
