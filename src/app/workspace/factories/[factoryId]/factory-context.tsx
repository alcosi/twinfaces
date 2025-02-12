import { Factory_DETAILED, hydrateFactoryFromMap } from "@/entities/factory";
import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { LoadingOverlay } from "@/shared/ui";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

interface FactoryContextProps {
  factoryId: string;
  factory: Factory_DETAILED | undefined;
  fetchFactoryData: () => void;
}

export const FactoryContext = createContext<FactoryContextProps>(
  {} as FactoryContextProps
);

export function FactoryContextProvider({
  factoryId,
  children,
}: {
  factoryId: string;
  children: ReactNode;
}) {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [factory, setFactory] = useState<Factory_DETAILED | undefined>(
    undefined
  );

  useEffect(() => {
    fetchFactoryData();
  }, []);

  function fetchFactoryData() {
    setLoading(true);
    api.factory
      .getById({
        id: factoryId,
        query: {
          lazyRelation: false,
          showFactoryMode: "DETAILED",
        },
      })
      .then((resp) => {
        const data = resp.data;

        if (!data || data.status !== 0) {
          console.error("failed to fetch factory", data);

          let message = "Failed to load factory";

          if (data?.msg) message += `: ${data.msg}`;
          toast.error(message);
          return;
        }

        if (data.factory && data.relatedObjects) {
          setFactory(hydrateFactoryFromMap(data.factory, data.relatedObjects));
        }
      })
      .catch((error) => {
        console.error("exception while fetchingfactory", error);
        toast.error("Failed to fetch factory");
      })
      .finally(() => setLoading(false));
  }

  if (isUndefined(factory)) return <>{loading && <LoadingOverlay />}</>;

  return (
    <FactoryContext.Provider value={{ factoryId, factory, fetchFactoryData }}>
      {loading && <LoadingOverlay />}
      {!loading && children}
    </FactoryContext.Provider>
  );
}
