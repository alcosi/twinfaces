import { useCallback, useContext, useState } from "react";

import { hydrateAttachmentFromMap } from "@/entities/twin";
import { AttachmentRqQuery, Attachment_DETAILED } from "@/entities/twin/server";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useAttachmentById = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAttachmentById = useCallback(
    async ({
      attachmentId,
      query,
    }: {
      attachmentId: string;
      query: AttachmentRqQuery;
    }): Promise<Attachment_DETAILED> => {
      setLoading(true);
      try {
        const { data, error } = await api.twin.getAttachment({
          attachmentId,
          query,
        });

        if (error) {
          throw new Error("Failed to fetch attachment due to API error");
        }

        if (isUndefined(data.attachment)) {
          throw new Error("Invalid response data while fetching attachment");
        }

        const attachment = hydrateAttachmentFromMap(
          data.attachment,
          data.relatedObjects
        );

        return attachment;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchAttachmentById, loading };
};
