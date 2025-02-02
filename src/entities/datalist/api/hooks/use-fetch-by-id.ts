import { useCallback, useContext, useState } from "react";
import { ApiContext } from "@/shared/api";
import { isUndefined } from "@/shared/libs";
import { DataList } from "@/entities/datalist";
import { operations } from "@/shared/api/generated/schema";

// TODO: Apply caching-strategy after discussing with team
export const useFetchDatalistById = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const api = useContext(ApiContext);

  const fetchDatalistById = useCallback(
    async ({
      dataListId,
      query,
    }: {
      dataListId: string;
      query: operations["dataListPublicViewV1"]["parameters"]["query"];
    }): Promise<DataList> => {
      setLoading(true);

      try {
        const { data, error } = await api.datalist.getById({
          dataListId,
          query,
        });

        if (error) {
          throw new Error("Failed to fetch datalist due to API error", error);
        }

        if (isUndefined(data?.dataList)) {
          throw new Error("Response does not have datalist data", error);
        }

        return data.dataList;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { fetchDatalistById, loading };
};
