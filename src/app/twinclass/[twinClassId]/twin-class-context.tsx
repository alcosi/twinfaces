import { LoadingOverlay } from "@/components/base/loading";
import { ApiContext } from "@/lib/api/api";
import { TwinClass, TwinClassStatus } from "@/lib/api/api-types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface TwinClassContextProps {
  twinClassId: string;
  twinClass: TwinClass | undefined;
  loading: boolean;
  fetchClassData: () => void;
  statuses: TwinClassStatus[];
  getStatusesBySearch: (search: string) => Promise<TwinClassStatus[]>;
  findStatusById: (id: string) => Promise<TwinClassStatus | undefined>;
}

export const TwinClassContext = createContext<TwinClassContextProps>(
  {} as TwinClassContextProps
);

export function TwinClassContextProvider({
  twinClassId,
  children,
}: {
  twinClassId: string;
  children: React.ReactNode;
}) {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [twinClass, setTwinClass] = useState<TwinClass | undefined>(undefined);
  const [statuses, setStatuses] = useState<TwinClassStatus[]>([]);

  useEffect(() => {
    fetchClassData();
  }, []);

  function fetchClassData() {
    setLoading(true);
    api.twinClass
      .getById({
        id: twinClassId,
        query: {
          showTwinClassMode: "MANAGED",
          showTwin2TwinClassMode: "MANAGED",
          showTwinClassHead2TwinClassMode: "MANAGED",
          showTwinClass2StatusMode: "DETAILED",
        },
      })
      .then((response) => {
        const data = response.data;
        if (!data || data.status != 0) {
          console.error("failed to fetch twin class", data);
          let message = "Failed to load twin class";
          if (data?.msg) message += `: ${data.msg}`;
          toast.error(message);
          return;
        }
        setTwinClass(data.twinClass);
        setStatuses(
          data.twinClass?.statusMap
            ? Object.values(data.twinClass?.statusMap)
            : []
        );
      })
      .catch((e) => {
        console.error("exception while fetching twin class", e);
        toast.error("Failed to fetch twin class");
      })
      .finally(() => setLoading(false));
  }

  async function getStatusesBySearch(search: string) {
    return statuses.filter(
      (status) =>
        (status.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (status.key ?? "").toLowerCase().includes(search.toLowerCase())
    );
  }

  async function findStatusById(id: string) {
    return statuses.find((x) => x.id === id);
  }

  return (
    <TwinClassContext.Provider
      value={{
        twinClassId,
        twinClass: twinClass,
        loading,
        fetchClassData,
        statuses,
        getStatusesBySearch,
        findStatusById,
      }}
    >
      {loading && <LoadingOverlay />}
      {!loading && children}
    </TwinClassContext.Provider>
  );
}
