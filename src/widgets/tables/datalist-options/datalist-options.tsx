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
  DATALIST_OPTION_SCHEMA,
  DataListOptionCreateRqDV1,
  DatalistOptionResourceLink,
  DataListOptionV3,
  useCreateDatalistOption,
  useDatalistOptionFilters,
  useDatalistOptionSearch,
} from "@/entities/datalist-option";
import { DataList, DatalistResourceLink } from "@/entities/datalist";
import { useRouter } from "next/navigation";
import { isTruthy, toArray, toArrayOfString } from "@/shared/libs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatalistOptionFormFields } from "./form-fields";

export function DatalistOptionsTable({ datalist }: { datalist?: DataList }) {
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { searchDatalistOptions } = useDatalistOptionSearch();
  const { createDatalistOption } = useCreateDatalistOption();
  const { buildFilterFields, mapFiltersToPayload } = useDatalistOptionFilters({
    enabledFilters: isTruthy(datalist?.id)
      ? ["idList", "optionI18nLikeList", "statusIdList"]
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
          dataListIdList: toArrayOfString(toArray(datalist?.id), "id"),
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

        ...(!datalist?.id
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
          id: "status",
          accessorKey: "status",
          header: "Status",
        },

        ...dynamicColumns,
      ]);

      return response;
    } catch (e) {
      toast.error("Failed to fetch datalist options");
      return { data: [], pagination: {} };
    }
  }

  const twinClassesForm = useForm<z.infer<typeof DATALIST_OPTION_SCHEMA>>({
    resolver: zodResolver(DATALIST_OPTION_SCHEMA),
    defaultValues: {
      dataListId: datalist || "",
      name: "",
      icon: "",
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof DATALIST_OPTION_SCHEMA> & {
      [key: string]: string;
    }
  ) => {
    const { name, icon, attribute1, attribute2, attribute3, attribute4 } =
      formValues;

    // TODO: complete `attributesMap`
    console.log("foobar attrs", {
      attribute1,
      attribute2,
      attribute3,
      attribute4,
    });
    const attributesMap = {};

    const requestBody: DataListOptionCreateRqDV1 = {
      dataListId: datalist?.id ? datalist.id : formValues.dataListId!,
      optionI18n: {
        translationInCurrentLocale: name,
        translations: {},
      },
      icon: icon,
      attributesMap,
    };

    // return createDatalistOption({ body: requestBody });
  };

  if (!datalist || !datalist.id) {
    console.error("DataList: no datalist");
    return;
  }

  return (
    <CrudDataTable
      title="Options"
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
      ref={tableRef}
      columns={columns}
      fetcher={fetchDatalistOptions}
      getRowId={(row) => row.id!}
      onRowClick={(row) => router.push(`/workspace/datalist-options/${row.id}`)}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      dialogForm={twinClassesForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <DatalistOptionFormFields control={twinClassesForm.control} />
      )}
    />
  );
}
