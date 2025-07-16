import { useCallback, useContext } from "react";

import { TwinLinkView } from "@/entities/link";
import { PagedResponse, PrivateApiContext } from "@/shared/api";

export const useFetchTwinLinks = () => {
  const api = useContext(PrivateApiContext);

  const fetchTwinLinksById = useCallback(
    async ({
      twinId,
      type,
    }: {
      twinId: string;
      type: "forward" | "backward";
    }): Promise<PagedResponse<TwinLinkView>> => {
      try {
        const { data, error } = await api.twin.getLinks({ twinId });

        if (error) {
          throw new Error("Failed to fetch twins due to API error");
        }

        const linksData = Object.values(
          data?.twin?.links?.[
            type === "forward" ? "forwardLinks" : "backwardLinks"
          ] || {}
        );

        return { data: linksData, pagination: {} };
      } catch (error) {
        throw new Error("An error occurred while fetching twins");
      }
    },
    [api]
  );

  return { fetchTwinLinksById };
};
