import { ReactNode } from "react";

import { AttachmentContextProvider } from "@/features/attachment";

type Props = {
  params: {
    attachmentId: string;
  };
  children: ReactNode;
};

export default function Layout({ params: { attachmentId }, children }: Props) {
  return (
    <AttachmentContextProvider attachmentId={attachmentId}>
      {children}
    </AttachmentContextProvider>
  );
}
