import { useCallback } from "react";
import { TwinStatus } from "../../api";

// TODO: Apply caching-strategy after discussing with team
export const useFetchTwinStatusById = () => {
  //   const { searchPermissionGroups } = usePermissionGroupSearchV1();

  const fetchTwinStatusById = useCallback(
    async (id: string): Promise<TwinStatus> => {
      return { id } as TwinStatus;
      // const { data } = await searchPermissionGroups({
      //   filters: {
      //     idList: [id],
      //   },
      // });

      // if (isUndefined(data[0])) {
      //   throw new Error(`Permission group with ID ${id} not found`);
      // }

      // return data[0];
    },
    []
  );

  return { fetchTwinStatusById };
};
