import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

import { LinkFilters, Link_MANAGED } from "..";
import { hydrateLinkFromMap } from "../../libs";

export function useLinkSearch() {
  const api = useContext(PrivateApiContext);

  const searchLinks = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: LinkFilters;
    }): Promise<PagedResponse<Link_MANAGED>> => {
      try {
        const { data, error } = await api.link.search({
          pagination,
          filters: {
            ...filters,
            forwardNameLikeList: isPopulatedString(search)
              ? [wrapWithPercent(search)]
              : filters?.forwardNameLikeList,
            // backwardNameLikeList: isPopulatedString(search)
            //   ? [wrapWithPercent(search)]
            //   : filters?.backwardNameLikeList,
          },
        });

        if (error) {
          throw new Error("Failed to fetch links due to API error");
        }

        const links =
          data?.links?.map((dto) =>
            hydrateLinkFromMap(dto, data.relatedObjects)
          ) ?? [];

        return {
          data: links,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        throw new Error("An error occurred while fetching datalist");
      }
    },
    [api]
  );

  return { searchLinks };
}
