import { useCallback, useContext } from "react";

import { DataListUpdateRqV1 } from "@/entities/datalist";
import { PrivateApiContext } from "@/shared/api";

export const useDatalistUpdate = () => {
  const api = useContext(PrivateApiContext);

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
