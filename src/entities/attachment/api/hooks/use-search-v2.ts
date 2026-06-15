import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import {
  AttachmentFilters,
  AttachmentSortField,
  Attachment_DETAILED,
  hydrateAttachmentFromMap,
} from "../../libs";

export const useAttachmentSearchV2 = () => {
  const api = useContext(PrivateApiContext);

  const searchAttachments = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
      sort,
    }: {
      pagination?: PaginationState;
      filters?: AttachmentFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<Attachment_DETAILED>> => {
      try {
        const { data, error } = await api.attachment.search({
          pagination,
          filters,
          sortField: sort?.field as AttachmentSortField | undefined,
          sortDirection: sort?.direction,
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
        throw new Error(
          "An error occurred while fetching attachments: " + error
        );
      }
    },
    [api]
  );

  return { searchAttachments };
};
