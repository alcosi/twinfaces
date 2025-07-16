import { useCallback, useContext } from "react";

import { DataListOptionUpdateRqV1 } from "@/entities/datalist-option";
import { PrivateApiContext } from "@/shared/api";

export const useUpdateDatalistOption = () => {
  const api = useContext(PrivateApiContext);

  const updateDatalistOption = useCallback(
    async ({
      dataListOptionId,
      body,
    }: {
      dataListOptionId: string;
      body: DataListOptionUpdateRqV1;
    }) => {
      return await api.datalistOption.update({ dataListOptionId, body });
    },
    [api]
  );

  return { updateDatalistOption };
};
