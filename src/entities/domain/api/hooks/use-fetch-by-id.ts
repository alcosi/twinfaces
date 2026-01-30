"use client";

import { useCallback, useContext, useState } from "react";

import {
  DomainViewQuery,
  DomainView_DETAILED,
  hydrateDomainView,
} from "@/entities/domain";
import { PrivateApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

export const useFetchDomainById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const api = useContext(PrivateApiContext);

  const fetchDomainById = useCallback(
    async ({
      domainId,
      query,
    }: {
      domainId: string;
      query: DomainViewQuery;
    }): Promise<DomainView_DETAILED> => {
      setLoading(true);

      try {
        const { data, error } = await api.domain.getById({
          domainId,
          query,
        });

        if (error) {
          throw new Error("Failed to fetch domain due to API error", error);
        }

        if (isUndefined(data?.domain)) {
          throw new Error("Response does not have domain data", error);
        }

        const domain = hydrateDomainView(data.domain, data.relatedObjects);

        return domain;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchDomainById, loading };
};
