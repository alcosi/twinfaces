import { useCallback, useState } from "react";

import { Twin_DETAILED, fetchTwinById as fetch } from "@/entities/twin/server";
import { clientCookies } from "@/shared/libs";

export const useTwinFetchByIdV2 = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const domainId = clientCookies.get("domainId");
  const authToken = clientCookies.get("authToken");

  const fetchTwinById = useCallback(
    async (id: string): Promise<Twin_DETAILED | undefined> => {
      setLoading(true);

      try {
        const { twin } = await fetch<Twin_DETAILED>(id, {
          header: {
            DomainId: domainId ?? "",
            AuthToken: authToken ?? "",
            Channel: "WEB",
          },
          query: {
            lazyRelation: "false",
            showTwinMode: "DETAILED",
            showTwinClassMode: "DETAILED",
            showTwin2TwinClassMode: "DETAILED",
            showTwin2UserMode: "DETAILED",
            showTwin2StatusMode: "DETAILED",
            showTwinMarker2DataListOptionMode: "DETAILED",
            showTwinByHeadMode: "YELLOW",
            showTwinAliasMode: "C",
            showTwinTag2DataListOptionMode: "DETAILED",
            showTwin2TransitionMode: "DETAILED",
          },
        });

        return twin;
      } finally {
        setLoading(false);
      }
    },
    [authToken, domainId]
  );

  return { fetchTwinById, loading };
};
