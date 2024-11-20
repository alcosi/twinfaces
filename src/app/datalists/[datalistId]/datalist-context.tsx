import { LoadingOverlay } from "@/components/base/loading";
import { ApiContext } from "@/shared/api";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { DataList } from "@/entities/datalist";

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
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [datalist, setDatalist] = useState<DataList | undefined>(undefined);

  useEffect(() => {
    fetchDatalist();
  }, []);

  function fetchDatalist() {
    setLoading(true);
    api.datalist
      .getById({
        id: datalistId,
        query: {
          showDataListMode: "DETAILED",
          showDataListOptionMode: "DETAILED",
        },
      })
      .then((response) => {
        const data = response.data;
        if (!data || data.status != 0) {
          console.error("failed to fetch datalist", data);
          let message = "Failed to load datalist";
          if (data?.msg) message += `: ${data.msg}`;
          toast.error(message);
          return;
        }
        setDatalist(data.dataList);
      })
      .catch((e) => {
        console.error("exception while fetching datalist", e);
        toast.error("Failed to fetch datalist");
      })
      .finally(() => setLoading(false));
  }

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
