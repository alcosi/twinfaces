"use client";

import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { toast } from "sonner";
import React, { useRef, useState } from "react";
import {
  DatalistOptionResourceLink,
  DataListOptionV3,
  useDatalistOptionFilters,
  useDatalistOptionsSearch,
} from "@/entities/option";
import { DatalistResourceLink } from "@/entities/datalist";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { isFalsy, toArray, toArrayOfString } from "@/shared/libs";

export function DatalistOptionsTable({ dataListId }: { dataListId?: string }) {
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { searchDatalistOptions } = useDatalistOptionsSearch();
  const { buildFilterFields, mapFiltersToPayload } = useDatalistOptionFilters({
    enabledFilters: isFalsy(dataListId)
      ? ["idList", "optionI18nLikeList"]
      : undefined,
  });
  const [columns, setColumns] = useState<ColumnDef<DataListOptionV3>[]>([]);

  async function fetchDatalistOptions(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<DataListOptionV3>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchDatalistOptions({
        pagination,
        filters: {
          ..._filters,
          dataListIdList: toArrayOfString(toArray(dataListId), "id"),
        },
      });

      const datalistOption = Object.values(response.data);
      const attributeKeys = new Set<string>();
      datalistOption.forEach((item: DataListOptionV3) => {
        if (item?.attributes) {
          Object.keys(item?.attributes).forEach((key) =>
            attributeKeys.add(key)
          );
        }
      });

      const dynamicColumns: ColumnDef<DataListOptionV3>[] = Array.from(
        attributeKeys
      ).map((key) => ({
        id: `attributes.${key}`,
        accessorKey: `attributes.${key}`,
        header: key,
      }));

      setColumns([
        {
          id: "id",
          accessorKey: "id",
          header: "ID",
          cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
        },

        {
          id: "icon",
          accessorKey: "icon",
          header: "Icon",
        },

        ...(!dataListId
          ? [
              {
                id: "dataListId",
                accessorKey: "dataListId",
                header: "Datalist",
                cell: ({ row }: { row: { original: DataListOptionV3 } }) =>
                  row.original.dataList ? (
                    <div className="max-w-48 inline-flex">
                      <DatalistResourceLink
                        data={row.original.dataList}
                        withTooltip
                      />
                    </div>
                  ) : null,
              },
            ]
          : []),

        {
          id: "name",
          accessorKey: "name",
          header: "Name",
          cell: ({ row: { original } }) =>
            original.dataList ? (
              <div className="max-w-48 inline-flex">
                <DatalistOptionResourceLink data={original} withTooltip />
              </div>
            ) : null,
        },

        {
          id: "disabled",
          accessorKey: "disabled",
          header: "Disabled",
          cell: (data) => data.getValue() && <Check />,
        },

        ...dynamicColumns,
      ]);

      return response;
    } catch (e) {
      toast.error("Failed to fetch datalist options");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      title="Options"
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
      ref={tableRef}
      columns={columns}
      fetcher={fetchDatalistOptions}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(
          dataListId
            ? `${row.dataListId}/options/${row.id}`
            : `datalists/${row.dataListId}/options/${row.id}`
        )
      }
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
    />
  );
}
