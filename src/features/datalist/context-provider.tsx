import { LoadingOverlay } from "@/shared/ui/loading";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { DataList, useFetchDatalistById } from "@/entities/datalist";
import { isUndefined } from "@/shared/libs";

interface DatalistContextProps {
  datalistId: string;
  datalist: DataList | undefined;
  fetchDatalist: () => void;
}

export const DatalistContext = createContext<DatalistContextProps>(
  {} as DatalistContextProps
);

export function DatalistContextProvider({
  datalistId,
  children,
}: {
  datalistId: string;
  children: React.ReactNode;
}) {
  const [datalist, setDatalist] = useState<DataList | undefined>(undefined);
  const { fetchDatalistById, loading } = useFetchDatalistById();

  useEffect(() => {
    fetchDatalist();
  }, [datalistId]);

  function fetchDatalist() {
    fetchDatalistById({
      dataListId: datalistId,
      query: {
        showDataListMode: "MANAGED",
      },
    })
      .then((response) => {
        setDatalist(response);
      })
      .catch((e) => {
        console.error("exception while fetching datalist", e);
        toast.error("Failed to fetch datalist");
      });
  }

  if (isUndefined(datalist)) return <>{loading && <LoadingOverlay />}</>;

  return (
    <DatalistContext.Provider
      value={{
        datalistId,
        datalist,
        fetchDatalist,
      }}
    >
      {loading && <LoadingOverlay />}
      {!loading && children}
    </DatalistContext.Provider>
  );
}
