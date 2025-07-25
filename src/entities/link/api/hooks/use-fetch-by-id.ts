import { useCallback, useContext, useState } from "react";

import { Link, QueryLinkViewV1, hydrateLinkFromMap } from "@/entities/link";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useLinkFetchById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const api = useContext(PrivateApiContext);

  const fetchLinkById = useCallback(
    async ({
      linkId,
      query,
    }: {
      linkId: string;
      query: QueryLinkViewV1;
    }): Promise<Link> => {
      setLoading(true);
      try {
        const { data, error } = await api.link.getById({
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
