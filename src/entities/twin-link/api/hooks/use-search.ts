import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext, SortV1 } from "@/shared/api";

import { hydrateTwinLinkFromMap } from "../../libs/helpers";
import {
  TwinLinkFilters,
  TwinLinkSortField,
  TwinLink_DETAILED,
} from "../types";

export function useTwinLinkSearch() {
  const api = useContext(PrivateApiContext);

  const searchTwinLinks = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
      sort,
    }: {
      pagination?: PaginationState;
      filters?: TwinLinkFilters;
      sort?: SortV1;
    }): Promise<PagedResponse<TwinLink_DETAILED>> => {
      try {
        const { data, error } = await api.twinLink.search({
          pagination,
          filters,
          sortField: sort?.field as TwinLinkSortField | undefined,
          sortDirection: sort?.direction,
        });

        if (error) {
          throw new Error("Failed to fetch twin links due to API error");
        }

        if (!data) {
          throw new Error("Response has no data");
        }

        const twinLinks =
          data.twinLinks?.map((dto) =>
            hydrateTwinLinkFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: twinLinks,
          pagination: data.pagination ?? {},
        };
      } catch {
        throw new Error("An error occurred while fetching twin links");
      }
    },
    [api]
  );

  return { searchTwinLinks };
}
