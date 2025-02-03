import { Twin } from "@/entities/twin";
import { TwinClassValidHeadQuery } from "@/entities/twinClass";
import { ApiContext, PagedResponse } from "@/shared/api";
import { useCallback, useContext } from "react";

// TODO: Apply caching-strategy
export const useFetchValidHeadTwins = () => {
  const api = useContext(ApiContext);

  const fetchValidHeadTwins = useCallback(
    async ({
      twinClassId,
    }: {
      twinClassId: string;
    }): Promise<PagedResponse<Twin>> => {
      const _query: TwinClassValidHeadQuery = {
        lazyRelation: false,
        showTwinAliasMode: "ALL",
        showTwinMode: "DETAILED",
      };

      try {
        const { data, error } = await api.twinClass.getValidHeads({
          twinClassId,
          query: _query,
        });

        if (error) {
          throw error;
        }

        return {
          data: data.twinList ?? [],
          pagination: {},
        };
      } catch (error) {
        throw new Error(`Failed to find twin class with ID ${twinClassId}`);
      }
    },
    [api]
  );

  return { fetchValidHeadTwins };
};
