import { TwinsAPI } from "@/shared/api";
import { isUndefined } from "@/shared/libs";

import { hydrateTwinFromMap } from "../libs";
import { Twin, TwinViewQuery } from "./types";

export async function fetchTwinById<T extends Twin>(
  twinId: string,
  options: {
    header: {
      DomainId: string;
      AuthToken: string;
      Channel: "WEB";
    };
    query?: TwinViewQuery;
  }
): Promise<T> {
  const { data, error } = await TwinsAPI.GET("/private/twin/{twinId}/v2", {
    params: {
      header: options.header,
      path: { twinId },
      query: {
        lazyRelation: false,
        ...options.query,
      },
    },
  });

  if (error) {
    throw new Error("Failed to fetch twin due to API error", error);
  }

  if (isUndefined(data.twin)) {
    throw new Error("Invalid response data while fetching twin", error);
  }

  if (data.relatedObjects) {
    return hydrateTwinFromMap<T>(data.twin, data.relatedObjects);
  }

  return data.twin as T;
}
