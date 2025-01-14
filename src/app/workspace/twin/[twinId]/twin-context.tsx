import { Twin } from "@/entities/twin";
import { ApiContext, RelatedObjects } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui/loading";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface TwinContextProps {
  twinId: string;
  twin: Twin | undefined;
  fetchTwinData: () => void;
  relatedObjects: RelatedObjects | undefined;
}

export const TwinContext = createContext<TwinContextProps>(
  {} as TwinContextProps
);

export function TwinContextProvider({
  twinId,
  children,
}: {
  twinId: string;
  children: React.ReactNode;
}) {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [twin, setTwin] = useState<Twin | undefined>(undefined);
  const [relatedObjects, setRelatedObjects] = useState<
    RelatedObjects | undefined
  >(undefined);

  useEffect(() => {
    fetchTwinData();
  }, []);
  useEffect(() => {
    fetchTwinData();
  }, []);

  function fetchTwinData() {
    setLoading(true);
    api.twin
      .getById({
        id: twinId,
        query: {
          lazyRelation: false,
          showTwinMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          showTwin2TwinClassMode: "DETAILED",
          showTwin2UserMode: "DETAILED",
          showTwin2StatusMode: "DETAILED",
          showTwinMarker2DataListOptionMode: "DETAILED",
          showTwinByHeadMode: "YELLOW",
        },
      })
      .then((response) => {
        const data = response.data;
        if (!data || data.status != 0) {
          console.error("failed to fetch twin", data);
          let message = "Failed to load twin";
          if (data?.msg) message += `: ${data.msg}`;
          toast.error(message);
          return;
        }
        setTwin(data.twin);
        setRelatedObjects(data?.relatedObjects);
      })
      .catch((e) => {
        console.error("exception while fetching twin", e);
        toast.error("Failed to fetch twin");
      })
      .finally(() => setLoading(false));
  }

  if (isUndefined(twin)) return <>{loading && <LoadingOverlay />}</>;

  return (
    <TwinContext.Provider
      value={{
        twinId,
        twin,
        fetchTwinData,
        relatedObjects,
      }}
    >
      {loading && <LoadingOverlay />}
      {!loading && children}
    </TwinContext.Provider>
  );
}
