import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { toast } from "sonner";
import { Factory_DETAILED } from "./types";
import { hydrateFactoryFromMap } from "../libs";

type Props = {
  factoryId: string;
  setFactory: (factory: Factory_DETAILED) => void;
  setLoading: (loading: boolean) => void;
};

export const useFetchFactoryData = ({
  factoryId,
  setFactory,
  setLoading,
}: Props) => {
  const api = useContext(ApiContext);

  const refresh = useCallback(() => {
    setLoading(true);
    api.factory
      .getById({
        id: factoryId,
        query: {
          lazyRelation: false,
          showFactoryMode: "DETAILED",
          showFactory2UserMode: "DETAILED",
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
  }, [factoryId, setFactory, setLoading]);

  return { refresh };
};
