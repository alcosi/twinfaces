import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { useCallback, useContext, useState } from "react";
import { hydrateLinkFromMap } from "../../libs";
import { QueryLinkViewV1, TwinClassLink } from "../types";

// TODO: Apply caching-strategy
export const useLinkFetchById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const api = useContext(ApiContext);

  const fetchLinkById = useCallback(
    async ({
      linkId,
      query,
    }: {
      linkId: string;
      query: QueryLinkViewV1;
    }): Promise<TwinClassLink> => {
      setLoading(true);
      try {
        const { data, error } = await api.twinClassLink.getById({
          linkId,
          query,
        });

        if (error) {
          throw new Error("Failed to fetch link due to API error");
        }

        if (isUndefined(data.link)) {
          throw new Error("Invalid response data while fetching link");
        }

        const link = hydrateLinkFromMap(data.link, data.relatedObjects);

        return link;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchLinkById, loading };
};
