"use client";

import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { operations } from "@/shared/api/generated/schema";
import { isUndefined } from "@/shared/libs";

import { DomainView } from "../types";

export const useFetchDomainById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const api = useContext(PrivateApiContext);

  const fetchDomainById = useCallback(
    async ({
      domainId,
      query,
    }: {
      domainId: string;
      query?: operations["domainViewV1"]["parameters"]["query"];
    }): Promise<DomainView> => {
      const _query = query ?? {
        lazyRelation: false,
        showDomainMode: "DETAILED",
      };

      setLoading(true);

      try {
        const { data, error } = await api.domain.getById({
          domainId,
          query: _query,
        });

        if (error) {
          throw new Error("Failed to fetch domain due to API error", error);
        }

        if (isUndefined(data.domain)) {
          throw new Error("Response does not have domain data", error);
        }

        return data.domain;
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchDomainById, loading };
};
