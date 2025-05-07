import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import {
  AttachmentFilters,
  Attachment_DETAILED,
  hydrateAttachmentFromMap,
} from "../../libs";

export const useAttachmentSearchV1 = () => {
  const api = useContext(PrivateApiContext);

  const searchAttachments = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: AttachmentFilters;
    }): Promise<PagedResponse<Attachment_DETAILED>> => {
      try {
        const { data, error } = await api.attachment.search({
          pagination,
          filters: filters,
        });

        if (error) {
          throw new Error("Failed to fetch attachment due to API error");
        }

        const attachments = data.attachments?.map((dto) =>
          hydrateAttachmentFromMap(dto, data.relatedObjects)
        );

        return {
          data: attachments ?? [],
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occurred while fetching attachments");
      }
    },
    [api]
  );

  return { searchAttachments };
};
