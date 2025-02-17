import { ApiContext } from "@/shared/api";
import { useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import { Factory_DETAILED } from "./types";
import { hydrateFactoryFromMap } from "../libs";

type Props = {
  factoryId: string;
};

export const useFetchFactoryData = ({ factoryId }: Props) => {
  const api = useContext(ApiContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [factory, setFactory] = useState<Factory_DETAILED | undefined>(
    undefined
  );

  const fetchFactoryById = useCallback(() => {
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

        if (data?.factory && data.relatedObjects) {
          setFactory(hydrateFactoryFromMap(data.factory, data.relatedObjects));
        }
      })
      .catch((error) => {
        console.error("exception while fetchingfactory", error);
        toast.error("Failed to fetch factory");
      })
      .finally(() => setLoading(false));
  }, [factoryId]);

  return { fetchFactoryById, loading, factory };
};
