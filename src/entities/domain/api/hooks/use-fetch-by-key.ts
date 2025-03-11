import { useCallback, useContext, useState } from "react";

import { PublicApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { useSubdomain } from "../../libs";
import { DomainViewPublic } from "../types";

export const useFetchDomainByKey = () => {
  const api = useContext(PublicApiContext);
  const { getSubdomain } = useSubdomain();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDomainByKey = useCallback(
    async (mockDomain?: string): Promise<DomainViewPublic | undefined> => {
      setLoading(true);
      const key = getSubdomain(mockDomain) ?? "";

      try {
        const { data, error } = await api.publicDomain.fetchPublicDomainData({
          key: key,
          query: {
            showDomainMode: "DETAILED",
          },
        });

        if (error) {
          throw new Error(error.statusDetails || "Failed to fetch domain data");
        }

        if (isUndefined(data.domain)) {
          throw new Error("Response does not have domain data", error);
        }

        return data.domain;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchDomainByKey, loading };
};
