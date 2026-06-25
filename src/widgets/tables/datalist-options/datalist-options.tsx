"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DataList } from "@/entities/datalist";
import {
  DATALIST_OPTION_SCHEMA,
  DataListOptionCreateRqDV1,
  DataListOptionFilterKeys,
  DataListOptionFilters,
  DataListOption_DETAILED,
  useCreateDatalistOption,
  useDatalistOptionCount,
  useDatalistOptionFilters,
  useDatalistOptionSearch,
} from "@/entities/datalist-option";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { DatalistResourceLink } from "@/features/datalist/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
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
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "../../crud-data-table";
import { DatalistOptionFormFields } from "./form-fields";

export function DatalistOptionsTable({ datalist }: { datalist?: DataList }) {
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { searchDatalistOptions } = useDatalistOptionSearch();
  const { countDatalistOption } = useDatalistOptionCount();
  const { createDatalistOption } = useCreateDatalistOption();
  const { buildFilterFields, mapFiltersToPayload } = useDatalistOptionFilters({
    enabledFilters: isTruthy(datalist?.id)
      ? ["idList", "optionI18nLikeList", "statusIdList", "custom"]
      : undefined,
  });
  const [columns, setColumns] = useState<ColumnDef<DataListOption_DETAILED>[]>(
    []
  );

  // Resolves the raw filter form state into the search/count payload, pinning
  // the datalist scope when the table is embedded under a single datalist.
  const resolveFilters = useCallback(
    (
      rawFilters: Record<DataListOptionFilterKeys, unknown>
    ): DataListOptionFilters => {
      const mapped = mapFiltersToPayload(rawFilters);
      return {
        ...mapped,
        dataListIdList: datalist
          ? toArrayOfString(toArray(datalist?.id), "id")
          : mapped.dataListIdList,
      };
    },
    [mapFiltersToPayload, datalist]
  );

  async function fetchDatalistOptions(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<DataListOption_DETAILED>> {
    try {
      const response = await searchDatalistOptions({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<DataListOptionFilterKeys, unknown>
        ),
        sort,
      });

      const datalistOption = Object.values(response.data);
      const attributeKeys = new Set<string>();
      datalistOption.forEach((item) => {
        if (item?.attributes) {
          Object.keys(item?.attributes).forEach((key) =>
            attributeKeys.add(key)
          );
        }
      });

      const dynamicColumns: ColumnDef<DataListOption_DETAILED>[] = Array.from(
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
                header: () => (
                  <SortableHeader title="Datalist" sortField="dataListName" />
                ),
                cell: ({
                  row,
                }: {
                  row: { original: DataListOption_DETAILED };
                }) =>
                  row.original.dataList ? (
                    <div className="inline-flex max-w-48">
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
          header: () => <SortableHeader title="Name" sortField="optionName" />,
          cell: ({ row: { original } }) =>
            original.dataListId ? (
              <div className="inline-flex max-w-48">
                <DatalistOptionResourceLink data={original} withTooltip />
              </div>
            ) : null,
        },

        {
          id: "status",
          accessorKey: "status",
          header: () => <SortableHeader title="Status" sortField="status" />,
        },

        {
          id: "custom",
          accessorKey: "custom",
          header: "Custom",
          cell: (data) => data.getValue() && <Check className="h-4 w-4" />,
        },

        ...dynamicColumns,
      ]);

      return response;
    } catch {
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

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/data_list_option/count/v1), bound to the active filters. When the
  // table is scoped to a single datalist, grouping by datalist would yield a
  // single slice, so that grouping is omitted in that case.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveFilters(
        filters as Record<DataListOptionFilterKeys, unknown>
      );

      const groupings: ChartGrouping[] = [
        {
          key: "status",
          label: "Status",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countDatalistOption({
                filters: resolved,
                groupField: "status",
                offset,
                limit,
              }),
            (g) => g.status,
            (g) => g.status
          ),
        },
        {
          key: "custom",
          label: "Custom",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countDatalistOption({
                filters: resolved,
                groupField: "custom",
                offset,
                limit,
              }),
            (g) =>
              g.custom == null ? undefined : g.custom ? "Custom" : "Not custom",
            (g) =>
              g.custom == null ? undefined : g.custom ? "Custom" : "Not custom"
          ),
        },
      ];

      if (!datalist?.id) {
        groupings.push({
          key: "dataList",
          label: "Datalist",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countDatalistOption({
                filters: resolved,
                groupField: "dataListId",
                offset,
                limit,
              }),
            (g) => g.dataListId,
            (g) => g.dataList?.name,
            (g) =>
              g.dataList && (
                <DatalistResourceLink data={g.dataList} withTooltip />
              )
          ),
        });
      }

      return groupings;
    },
    [countDatalistOption, resolveFilters, datalist?.id]
  );

  return (
    <CrudDataTable
      permissionSegment="datalist-options"
      title="Options"
      ref={tableRef}
      columns={columns}
      fetcher={fetchDatalistOptions}
      getRowId={(row) => row.id!}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      chartGroupings={buildChartGroupings}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/datalist-options/${row.id}`)
      }
      dialogForm={twinClassesForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <DatalistOptionFormFields control={twinClassesForm.control} />
      )}
    />
  );
}
