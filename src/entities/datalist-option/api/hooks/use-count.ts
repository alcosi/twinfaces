import { useCallback, useContext } from "react";

import { DataList } from "@/entities/datalist";
import {
  DataListOptionCountGroupField,
  DataListOptionFilters,
} from "@/entities/datalist-option";
import { CountResult, PrivateApiContext } from "@/shared/api";

/** A single server-aggregated group, hydrated with its related entity. */
export type DataListOptionCountGroup = {
  count: number;
  dataListId?: string;
  businessAccountId?: string;
  status?: "active" | "disabled" | "hidden";
  custom?: boolean;
  dataList?: DataList;
};

export function useDatalistOptionCount() {
  const api = useContext(PrivateApiContext);

  const countDatalistOption = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: DataListOptionFilters;
      groupField: DataListOptionCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<DataListOptionCountGroup>> => {
      try {
        const { data, error } = await api.datalistOption.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count datalist options due to API error");
        }

        const related = data.relatedObjects;
        const counts = data.counts ?? [];

        const items = counts.map((group) => ({
          count: group.count ?? 0,
          dataListId: group.dataListId,
          businessAccountId: group.businessAccountId,
          status: group.status,
          custom: group.custom,
          dataList:
            group.dataListId && related?.dataListsMap
              ? related.dataListsMap[group.dataListId]
              : undefined,
        }));

        return {
          items,
          total: data.pagination?.total ?? items.length,
        };
      } catch {
        throw new Error("An error occurred while counting datalist options");
      }
    },
    [api]
  );

  return { countDatalistOption };
}
