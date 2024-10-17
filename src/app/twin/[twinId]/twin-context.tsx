import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { TwinBase } from "@/lib/api/api-types";
import { ApiContext } from "@/lib/api/api";
import { LoadingOverlay } from "@/components/base/loading";
import { toast } from "sonner";

interface TwinContextProps {
  twinId: string;
  twin: TwinBase | undefined;
  fetchTwinData: () => void;
}

export const TwinContext = createContext<TwinContextProps>(
  {} as TwinContextProps
);

export function TwinContextProvider({
  twinId,
  children,
}: {
  twinId: string;
  children: ReactNode;
}) {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [twin, setTwin] = useState<TwinBase | undefined>(undefined);

  useEffect(() => {
    fetchTwinData();
  }, []);

  function fetchTwinData() {
    setLoading(true);
    api.twin
      .getById({
        id: twinId,
        query: {
          showTwinMode: "DETAILED",
          showTwinClassMode: "DETAILED",
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
      })
      .catch((e) => {
        console.error("exception while fetching twin", e);
        toast.error("Failed to fetch twin");
      })
      .finally(() => setLoading(false));
  }

  return (
    <TwinContext.Provider
      value={{
        twinId,
        twin,
        fetchTwinData,
      }}
    >
      {loading && <LoadingOverlay />}
      {!loading && children}
    </TwinContext.Provider>
  );
}
