"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DataList, DatalistResourceLink } from "@/entities/datalist";
import {
  DATALIST_OPTION_SCHEMA,
  DataListOptionCreateRqDV1,
  DataListOptionV3,
  DatalistOptionResourceLink,
  useCreateDatalistOption,
  useDatalistOptionFilters,
  useDatalistOptionSearch,
} from "@/entities/datalist-option";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import {
  isPopulatedArray,
  isPopulatedString,
  isTruthy,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { DatalistOptionFormFields } from "./form-fields";

export function DatalistOptionsTable({ datalist }: { datalist?: DataList }) {
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { searchDatalistOptions } = useDatalistOptionSearch();
  const { createDatalistOption } = useCreateDatalistOption();
  const { buildFilterFields, mapFiltersToPayload } = useDatalistOptionFilters({
    enabledFilters: isTruthy(datalist?.id)
      ? ["idList", "optionLikeList", "statusIdList"]
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
      dataList: datalist ? [datalist] : [],
      name: "",
      icon: "",
      attribute1: undefined,
      attribute2: undefined,
      attribute3: undefined,
      attribute4: undefined,
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof DATALIST_OPTION_SCHEMA> & {
      [key: string]: string;
    }
  ) => {
    const { name, icon, attribute1, attribute2, attribute3, attribute4 } =
      formValues;

    const datalist: DataList = isPopulatedArray<DataList>(formValues.dataList)
      ? formValues.dataList[0]
      : (formValues.dataList as DataList);

    const attributesMap = [
      { key: datalist.attribute1?.key, value: attribute1 },
      { key: datalist.attribute2?.key, value: attribute2 },
      { key: datalist.attribute3?.key, value: attribute3 },
      { key: datalist.attribute4?.key, value: attribute4 },
    ].reduce(
      (acc, { key, value }) => {
        if (isPopulatedString(key)) {
          acc[key] = value!;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const requestBody: DataListOptionCreateRqDV1 = {
      dataListId: datalist.id,
      optionI18n: {
        translationInCurrentLocale: name,
        translations: {},
      },
      icon: icon,
      attributesMap,
    };

    return createDatalistOption({ body: requestBody }).then(() => {
      toast.success("Datalist option created successfully!");
    });
  };

  return (
    <CrudDataTable
      title="Options"
      ref={tableRef}
      columns={columns}
      fetcher={fetchDatalistOptions}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/datalist-options/${row.id}`)
      }
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
