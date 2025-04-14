"use client";

import { PaginationState } from "@tanstack/table-core";
import { useCallback, useContext, useEffect, useState } from "react";

import { PagedResponse, PrivateApiContext } from "@/shared/api";

import { hydrateDomainView } from "../../libs";
import { DomainView_SHORT } from "../types";

export const useDomains = () => {
  const api = useContext(PrivateApiContext);
  const [response, setResponse] = useState<PagedResponse<DomainView_SHORT>>();

  const fetchDomainsList = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
    }: {
      pagination?: PaginationState;
    }): Promise<PagedResponse<DomainView_SHORT>> => {
      try {
        const { data, error } = await api.domain.fetchList({ pagination });

        if (error) {
          throw new Error("Failed to fetch domains due to API error");
        }

        const response = {
          data: data.domainList?.map((dto) => hydrateDomainView(dto)) ?? [],
          pagination: data.pagination ?? {},
        };

        setResponse(response);
        return response;
      } catch (error) {
        throw new Error("Failed to fetch domains due to API error");
      }
    },
    [api]
  );

  useEffect(() => {
    fetchDomainsList({});
  }, [fetchDomainsList]);

  return {
    ...response,
    fetch: fetchDomainsList,
  };
};
