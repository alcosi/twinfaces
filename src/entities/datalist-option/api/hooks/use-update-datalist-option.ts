import { ApiContext } from "@/shared/api";
import { useCallback, useContext } from "react";
import { DataListOptionUpdateRqV1 } from "@/entities/datalist-option";

// TODO: Apply caching-strategy
export const useUpdateDatalistOption = () => {
  const api = useContext(ApiContext);

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
