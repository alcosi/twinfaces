import { useCallback, useContext } from "react";

import { PrivateApiContext, RelatedObjects } from "@/shared/api";

import { Factory } from "../types";

export type FactoryUsages = {
  factories: Factory[];
  /** Holds the entities the usages point at — pipelines, transitions, … */
  relatedObjects: RelatedObjects;
};

/**
 * Loads the usages of a given set of factories: every place each of them is
 * referenced from.
 *
 * A factory view carries the usages of the factory it was asked for, but not of
 * the ones it delivers alongside it, so the graph cannot get this out of its
 * cascade — it asks for all the factories it draws in one search instead.
 */
export const useFetchFactoryUsages = () => {
  const api = useContext(PrivateApiContext);

  const fetchFactoryUsages = useCallback(
    async (factoryIds: string[]): Promise<FactoryUsages> => {
      if (factoryIds.length === 0) {
        return { factories: [], relatedObjects: {} };
      }

      const { data, error } = await api.factory.search({
        // One page, sized to the request: the ids are the whole query.
        pagination: { pageIndex: 0, pageSize: factoryIds.length },
        filters: { idList: factoryIds },
        showUsages: true,
      });

      if (error) {
        throw new Error("Failed to fetch factory usages due to API error");
      }

      return {
        factories: data?.factories ?? [],
        relatedObjects: data?.relatedObjects ?? {},
      };
    },
    [api]
  );

  return { fetchFactoryUsages };
};
