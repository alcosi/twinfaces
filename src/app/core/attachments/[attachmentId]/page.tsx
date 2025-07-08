import { AttachmentContextProvider } from "@/features/attachment";
import { AttachmentScreen } from "@/screens/attachment";

type Props = {
  params: Promise<{
    attachmentId: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  const { attachmentId } = params;

  return (
    <AttachmentContextProvider attachmentId={attachmentId}>
      <AttachmentScreen />
    </AttachmentContextProvider>
  );
}
