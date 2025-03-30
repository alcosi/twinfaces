import { useCallback, useContext } from "react";

import { TwinClassValidHeadQuery } from "@/entities/twin-class";
import { Twin } from "@/entities/twin/server";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isPopulatedString, wrapWithPercent } from "@/shared/libs";

// TODO: Apply caching-strategy
export const useFetchValidHeadTwins = () => {
  const api = useContext(PrivateApiContext);

  const fetchValidHeadTwins = useCallback(
    async ({
      twinClassId,
      search,
    }: {
      twinClassId: string;
      search?: string;
    }): Promise<PagedResponse<Twin>> => {
      const _query: TwinClassValidHeadQuery = {
        lazyRelation: false,
        showTwinAliasMode: "C",
        showTwinMode: "DETAILED",
      };

      try {
        const { data, error } = await api.twinClass.getValidHeads({
          twinClassId,
          query: _query,
          filters: {
            nameLike: isPopulatedString(search)
              ? wrapWithPercent(search)
              : undefined,
          },
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
