import { useCallback, useContext } from "react";

import { DataListUpdate } from "@/entities/datalist";
import { PrivateApiContext } from "@/shared/api";

export const useDatalistUpdate = () => {
  const api = useContext(PrivateApiContext);

  const updateDatalist = useCallback(
    async ({
      dataListId,
      body,
    }: {
      dataListId: string;
      body: Omit<DataListUpdate, "id">;
    }) => {
      return await api.datalist.update({
        body: { dataLists: [{ id: dataListId, ...body }] },
      });
    },
    [api]
  );

  return { updateDatalist };
};
