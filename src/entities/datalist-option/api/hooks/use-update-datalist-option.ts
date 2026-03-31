import { useCallback, useContext } from "react";

import { DataListOptionUpdateRqV2 } from "@/entities/datalist-option";
import { PrivateApiContext } from "@/shared/api";

export const useUpdateDatalistOption = () => {
  const api = useContext(PrivateApiContext);

  const updateDatalistOption = useCallback(
    async ({ body }: { body: DataListOptionUpdateRqV2 }) => {
      return await api.datalistOption.update({ body });
    },
    [api]
  );

  return { updateDatalistOption };
};
