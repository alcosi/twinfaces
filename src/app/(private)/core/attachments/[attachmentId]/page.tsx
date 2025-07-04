import { AttachmentContextProvider } from "@/features/attachment";
import { AttachmentScreen } from "@/screens/attachment";

type Props = {
  params: {
    attachmentId: string;
  };
};

export default function Page({ params: { attachmentId } }: Props) {
  return (
    <AttachmentContextProvider attachmentId={attachmentId}>
      <AttachmentScreen />
    </AttachmentContextProvider>
  );
}
