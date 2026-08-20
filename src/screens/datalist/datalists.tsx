"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useCallback, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  DATALIST_SCHEMA,
  DataList,
  DataListCreateRqV1,
  DatalistFilterKeys,
  useDatalistCount,
  useDatalistCreate,
  useDatalistFilters,
  useDatalistSearchV1,
} from "@/entities/datalist";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui/guid";
import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "@/widgets/crud-data-table";

import { DatalistFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    DataList,
    "id" | "key" | "name" | "updatedAt" | "description" | "createdAt"
  >,
  ColumnDef<DataList>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  key: {
    id: "key",
    accessorKey: "key",
    header: () => <SortableHeader title="Key" sortField="key" />,
  },

  name: {
    id: "name",
    accessorKey: "name",
    header: () => <SortableHeader title="Name" sortField="name" />,
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: () => (
      <SortableHeader title="Description" sortField="description" />
    ),
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
  },

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: () => <SortableHeader title="Сreated at" sortField="createdAt" />,
    cell: ({ row: { original } }) =>
      original.createdAt
        ? new Date(original.createdAt).toLocaleDateString()
        : "",
  },

  updatedAt: {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: () => <SortableHeader title="Updated at" sortField="updatedAt" />,
    cell: ({ row: { original } }) =>
      original.updatedAt
        ? new Date(original.updatedAt).toLocaleDateString()
        : "",
  },
};

export const DatalistsScreen = () => {
  const tableRef = useRef<DataTableHandle>(null);
  const { buildFilterFields, mapFiltersToPayload } = useDatalistFilters();
  const { searchDatalist } = useDatalistSearchV1();
  const { countDatalists } = useDatalistCount();
  const { createDatalist } = useDatalistCreate();

  async function fetchDataLists(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<DataList>> {
    return searchDatalist({
      pagination,
      filters: mapFiltersToPayload(filters.filters),
      sort,
    });
  }

  // Builds the pie-chart breakdown from the server-side count endpoint
  // (/private/data_list/count/v1), bound to the active filters. `createdByUserId`
  // is the only field the endpoint groups by — it has no column of its own, the
  // chart is the only place it surfaces.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<DatalistFilterKeys, unknown>
      );

      return [
        {
          key: "createdByUser",
          label: "Created by",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countDatalists({
                filters: resolved,
                groupField: "createdByUserId",
                offset,
                limit,
              }),
            (g) => g.createdByUserId,
            (g) => g.createdByUser?.fullName,
            (g) =>
              g.createdByUser && (
                <UserResourceLink data={g.createdByUser} withTooltip />
              )
          ),
        },
      ];
    },
    [mapFiltersToPayload, countDatalists]
  );

  const datalistForm = useForm<z.infer<typeof DATALIST_SCHEMA>>({
    resolver: zodResolver(DATALIST_SCHEMA),
    defaultValues: {
      key: "",
      name: "",
      description: "",
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof DATALIST_SCHEMA>
  ) => {
    const { key, name, description, ...rest } = formValues;

    const requestBody: DataListCreateRqV1 = {
      ...rest,
      key: key,
      nameI18n: {
        translationInCurrentLocale: name,
        translations: {},
      },
      descriptionI18n: description
        ? {
            translationInCurrentLocale: description,
            translations: {},
          }
        : undefined,
    };

    createDatalist({ body: requestBody }).then(() => {
      toast.success("Datalist created successfully!");
      tableRef.current?.refresh();
    });
  };

  return (
    <CrudDataTable
      title="Datalists"
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.createdAt,
        colDefs.updatedAt,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchDataLists}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      chartGroupings={buildChartGroupings}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.createdAt,
        colDefs.updatedAt,
      ]}
      dialogForm={datalistForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <DatalistFormFields control={datalistForm.control} />
      )}
    />
  );
};
