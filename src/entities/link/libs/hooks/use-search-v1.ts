import { ApiContext, PagedResponse } from "@/shared/api";
import { useCallback, useContext } from "react";
import { PaginationState } from "@tanstack/react-table";
import { Link_MANAGED } from "../../api";
import { hydrateLinkFromMap } from "../helpers";

export function useLinkSearch() {
  const api = useContext(ApiContext);

  const searchLink = useCallback(
    async ({
      pagination,
      filters = {},
    }: {
      pagination: PaginationState;
      filters?: {};
    }): Promise<PagedResponse<Link_MANAGED>> => {
      try {
        const { data, error } = await api.link.search({
          pagination,
          filters,
        });

        if (error) {
          throw error;
        }

        const links = (data.links || []).map((dto) =>
          hydrateLinkFromMap(dto, data.relatedObjects)
        );

        return {
          data: links,
          pagination: data.pagination ?? {},
        };
      } catch (error) {
        console.error("Failed to fetch links: ", error);
        throw new Error("An error occured while fetching links: " + error);
      }
    },
    [api]
  );

  return { searchLink };
}
