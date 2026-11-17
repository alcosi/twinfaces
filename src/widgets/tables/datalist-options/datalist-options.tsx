"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { DataList } from "@/entities/datalist";
import {
  DATALIST_OPTION_SCHEMA,
  DataListOptionCountGroup,
  DataListOptionCountGroupField,
  DataListOptionFilterKeys,
  DataListOptionFilters,
  DataListOption_DETAILED,
  buildDatalistOptionCreateRq,
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
import { BooleanIndicator, GuidWithCopy } from "@/shared/ui";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
  buildCountGroupings,
  narrowBy,
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

  // Derives the columns from a page of fetched options — the attribute columns
  // depend on the options themselves. Shared by the flat fetcher and the rows
  // of the grouped view, which may be the only fetch the table makes.
  const applyColumns = useCallback(
    (response: PagedResponse<DataListOption_DETAILED>) => {
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
          cell: (data) => <BooleanIndicator value={!!data.getValue()} />,
        },

        ...dynamicColumns,
      ]);
    },
    [datalist?.id]
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

      applyColumns(response);

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
    return createDatalistOption({
      body: buildDatalistOptionCreateRq(formValues),
    }).then(() => {
      toast.success("Datalist option created successfully!");
    });
  };

  // Server-side breakdowns backed by /private/data_list_option/count/v1, bound
  // to the active filters: the pie charts, and the grouping of the table view,
  // whose groups open through the matching search filters. When the table is
  // scoped to a single datalist, grouping by datalist would yield a single
  // slice, so that grouping is omitted in that case.
  const { chartGroupings, grouping } = useMemo(
    () =>
      buildCountGroupings<
        DataListOption_DETAILED,
        DataListOptionCountGroup,
        DataListOptionFilters
      >({
        fields: [
          {
            key: "status",
            label: "Status",
            groupField: "status",
            getValue: (g) => g.status,
            getText: (g) => g.status,
            narrow: narrowBy.valueList<DataListOptionFilters>("statusIdList"),
          },
          {
            key: "custom",
            label: "Custom",
            groupField: "custom",
            getValue: (g) => (g.custom == null ? undefined : String(g.custom)),
            getText: (g) =>
              g.custom == null ? undefined : g.custom ? "Custom" : "Not custom",
            narrow: narrowBy.ternary<DataListOptionFilters>("custom"),
          },
          ...(!datalist?.id
            ? [
                {
                  key: "dataList",
                  label: "Datalist",
                  groupField: "dataListId",
                  getValue: (g: DataListOptionCountGroup) => g.dataListId,
                  getText: (g: DataListOptionCountGroup) => g.dataList?.name,
                  renderLabel: (g: DataListOptionCountGroup) =>
                    g.dataList && (
                      <DatalistResourceLink data={g.dataList} withTooltip />
                    ),
                  narrow:
                    narrowBy.idList<DataListOptionFilters>("dataListIdList"),
                },
              ]
            : []),
        ],
        resolveFilters: ({ filters }) =>
          resolveFilters(filters as Record<DataListOptionFilterKeys, unknown>),
        count: ({ filters, groupField, offset, limit }) =>
          countDatalistOption({
            filters,
            groupField: groupField as DataListOptionCountGroupField,
            offset,
            limit,
          }),
        fetchRows: async ({ filters, pagination, sort }) => {
          const response = await searchDatalistOptions({
            pagination,
            filters,
            sort,
          });
          applyColumns(response);
          return response;
        },
      }),
    [
      countDatalistOption,
      searchDatalistOptions,
      resolveFilters,
      applyColumns,
      datalist?.id,
    ]
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
      chartGroupings={chartGroupings}
      grouping={grouping}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/datalist-options/${row.id}`)
      }
      getRowHref={(row) => `/${PlatformArea.core}/datalist-options/${row.id}`}
      dialogForm={twinClassesForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <DatalistOptionFormFields control={twinClassesForm.control} />
      )}
    />
  );
}
