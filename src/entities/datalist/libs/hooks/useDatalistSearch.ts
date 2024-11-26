import { useCallback, useContext } from "react";
import { ApiContext } from "@/shared/api";
import { PaginationState } from "@tanstack/table-core";
import { DataList, DatalistApiFilters } from "@/entities/datalist";
import { toast } from "sonner";

export const useDatalistSearch = () => {
  const api = useContext(ApiContext);

  const searchDatalist = useCallback(
    async ({
      pagination = { pageIndex: 0, pageSize: 10 },
      filters = {},
    }: {
      pagination?: PaginationState;
      filters?: DatalistApiFilters;
    }): Promise<{ data: DataList[]; pageCount: number }> => {
      try {
        const response = await api.datalist.searchDatalist({
          pagination,
          filters,
        });

        const data = response.data?.dataListList ?? [];

        return { data: data, pageCount: 0 };
      } catch (e) {
        console.error("Failed to fetch datalists", e);
        toast.error("Failed to fetch datalists");
        return { data: [], pageCount: 0 };
      }
    },
    [api]
  );

  return { searchDatalist };
};
