import { PaginationState } from "@tanstack/react-table";
import { useCallback, useContext, useState } from "react";

import { PrivateApiContext } from "@/shared/api";
import { wrapWithPercent } from "@/shared/libs";

import { hydrateTwinClassFieldFromMap } from "../../libs";
import {
  TwinClassFieldSearchFilters,
  TwinClassFieldSearchRsV1,
} from "../types";

export const useTwinClassFieldSearch = () => {
  const api = useContext(PrivateApiContext);
  const [loading, setLoading] = useState<boolean>(false);

  const searchBySearchId = useCallback(
    async (args: {
      searchId: string;
      narrow: TwinClassFieldSearchFilters;
      params?: Record<string, string>;
    }) => {
      setLoading(true);

      try {
        const { data, error } = await api.twinClassField.searchBySearchId(args);

        if (error) throw error;

        return { data: mapAndHydrate(data), pagination: undefined };
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const searchByFilters = useCallback(
    async ({
      search,
      pagination = { pageIndex: 0, pageSize: 10 },
      filters,
    }: {
      search?: string;
      pagination?: PaginationState;
      filters?: TwinClassFieldSearchFilters;
    }) => {
      setLoading(true);

      try {
        const payload = {
          ...filters,
          keyLikeList: search
            ? [wrapWithPercent(search)]
            : filters?.keyLikeList,
        };

        const { data, error } = await api.twinClassField.search({
          pagination,
          filters: payload,
        });

        if (error) throw error;

        return { data: mapAndHydrate(data), pagination: data.pagination };
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { loading, searchBySearchId, searchByFilters };
};

function mapAndHydrate(res: TwinClassFieldSearchRsV1) {
  return (res.fields ?? []).map((dto) =>
    hydrateTwinClassFieldFromMap(dto, res.relatedObjects)
  );
}
