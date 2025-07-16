import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import {
  AttachmentRqQuery,
  Attachment_DETAILED,
  hydrateAttachmentFromMap,
} from "../../libs";

export const useAttachmentFetchById = () => {
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
        const { data, error } = await api.attachment.getById({
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
