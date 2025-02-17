import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { DataListUpdateRqV1 } from "@/entities/datalist";

// TODO: Apply caching-strategy
export const useDatalistUpdate = () => {
  const api = useContext(ApiContext);

  const updateDatalist = useCallback(
    async ({
      dataListId,
      body,
    }: {
      dataListId: string;
      body: DataListUpdateRqV1;
    }) => {
      return await api.datalist.update({ dataListId, body });
    },
    [api]
  );

  return { updateDatalist };
};
