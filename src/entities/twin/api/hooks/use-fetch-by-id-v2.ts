"use client";

import { useCallback, useState } from "react";

import { hydrateTwinFromMap } from "@/entities/twin/server";
import type { Twin, Twin_DETAILED } from "@/entities/twin/server";

function buildTwinUrl(id: string) {
  const url = new URL(
    `/api/proxy/private/twin/${id}/v2`,
    window.location.origin
  );
  const q = url.searchParams;

  q.set("lazyRelation", "false");
  q.set("showTwinMode", "DETAILED");
  q.set("showTwinClassMode", "DETAILED");
  q.set("showTwin2TwinClassMode", "DETAILED");
  q.set("showTwin2UserMode", "DETAILED");
  q.set("showTwin2StatusMode", "DETAILED");
  q.set("showTwinMarker2DataListOptionMode", "DETAILED");
  q.set("showTwinByHeadMode", "YELLOW");
  q.set("showTwinAliasMode", "C");
  q.set("showTwinTag2DataListOptionMode", "DETAILED");
  q.set("showTwin2TransitionMode", "DETAILED");
  q.set("showTwinFieldCollectionMode", "SHOW");
  q.set("showTwinFieldCollectionFilterEmptyMode", "ANY");
  q.set("showTwinFieldAttributeMode", "SHOW");
  q.set("showTwinClass2TwinClassFieldMode", "DETAILED");
  q.set("showTwinClassFieldCollectionMode", "SHOW");
  q.set("showTwinFieldCollectionFilterRequiredMode", "ANY");
  q.set("showTwinFieldCollectionFilterSystemMode", "ANY");
  q.set("showTwinClassFieldCollectionFilterRequiredMode", "ANY");
  q.set("showTwinClassFieldCollectionFilterSystemMode", "ANY");
  q.set("showTwinField2DataListOptionMode", "DETAILED");
  q.set("showTwinByLinkMode", "GREEN");
  q.set("showTwin2TwinLinkMode", "SHORT");

  return url.toString();
}

export const useTwinFetchByIdV2 = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchTwinById = useCallback(
    async (id: string): Promise<Twin_DETAILED | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(buildTwinUrl(id), {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });

        if (!res.ok) throw new Error(`Twin ${id} fetch failed (${res.status})`);

        const data = await res.json();
        const payload = (data.twin ?? data) as Twin;
        const hydrated = hydrateTwinFromMap(payload, data.relatedObjects);
        return hydrated as Twin_DETAILED;
      } catch (e) {
        setError(e);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { fetchTwinById, loading, error };
};
