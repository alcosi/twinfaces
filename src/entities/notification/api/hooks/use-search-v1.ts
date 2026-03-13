import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateRecipientFromMap } from "../../libs";
import { RecipientFilters, Recipient_DETAILED } from "../types";

export function useRecipientSearch() {
  const api = useContext(PrivateApiContext);

  const searchRecipient = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: RecipientFilters;
    }): Promise<PagedResponse<Recipient_DETAILED>> => {
      try {
        const { data, error } = await api.recipient.search({
          pagination,
          filters,
        });

        if (error) {
          throw new Error("Failed to fetch recipients due to API error");
        }

        const recipients = data.recipients?.map((dto) =>
          hydrateRecipientFromMap(dto, data.relatedObjects)
        );

        return {
          data: recipients ?? [],
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error("An error occured while fetching recipients");
      }
    },
    [api]
  );

  return { searchRecipient };
}
