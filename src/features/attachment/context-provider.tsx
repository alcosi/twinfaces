"use client";

import { ReactNode, createContext, useEffect, useState } from "react";

import {
  Attachment_DETAILED,
  useAttachmentFetchById,
} from "@/entities/attachment";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";

type AttachmentContextProps = {
  attachmentId: string;
  attachment: Attachment_DETAILED;
  refresh: () => Promise<void>;
};

export const AttachmentContext = createContext<AttachmentContextProps>(
  {} as AttachmentContextProps
);

export function AttachmentContextProvider({
  attachmentId,
  children,
}: {
  attachmentId: string;
  children: ReactNode;
}) {
  useEffect(() => {
    refresh();
  }, [attachmentId]);

  const [attachment, setAttachment] = useState<Attachment_DETAILED | undefined>(
    undefined
  );
  const { fetchAttachmentById, loading } = useAttachmentFetchById();

  async function refresh() {
    try {
      const response = await fetchAttachmentById({
        attachmentId,
        query: {
          lazyRelation: false,
          showAttachmentMode: "DETAILED",
          showAttachment2TwinMode: "DETAILED",
          showAttachment2TransitionMode: "DETAILED",
          showAttachment2UserMode: "DETAILED",
          showAttachment2PermissionMode: "DETAILED",
          showAttachment2CommentModeMode: "DETAILED",
          showAttachmentCollectionMode: "ALL",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwin2TwinClassMode: "DETAILED",
        },
      });

      if (response) {
        setAttachment(response);
      }
    } catch (error) {
      console.error("Failed to fetch attachment:", error);
    }
  }

  if (isUndefined(attachment) || loading) return <LoadingOverlay />;

  return (
    <AttachmentContext.Provider value={{ attachmentId, attachment, refresh }}>
      {children}
    </AttachmentContext.Provider>
  );
}
