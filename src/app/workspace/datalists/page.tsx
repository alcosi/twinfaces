"use client";

import {
  DataList,
  DATALIST_SCHEMA,
  DataListCreateRqV1,
  DatalistResourceLink,
  useDatalistFilters,
  useDatalistSearchV1,
} from "@/entities/datalist";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext } from "@/shared/api";
import { DataTableHandle, FiltersState } from "@/widgets/crud-data-table";
import { toast } from "sonner";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui/guid";
import { CrudDataTable } from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatalistFormFields } from "@/screens/datalist";

const colDefs: Record<
  keyof Pick<DataList, "id" | "key" | "name" | "updatedAt" | "description">,
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
  },

  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <DatalistResourceLink data={original} withTooltip />
      </div>
    ),
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },

  updatedAt: {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: ({ row: { original } }) =>
      original.updatedAt
        ? new Date(original.updatedAt).toLocaleDateString()
        : "",
  },
};

const DatalistsPage = () => {
  const api = useContext(ApiContext);
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { buildFilterFields, mapFiltersToPayload } = useDatalistFilters();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchDatalist } = useDatalistSearchV1();

  useEffect(() => {
    setBreadcrumbs([{ label: "Datalists", href: "/workspace/datalists" }]);
  }, []);

  async function fetchDataLists(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<DataList>> {
    const _filters = mapFiltersToPayload(filters.filters);

    return searchDatalist({ pagination, filters: _filters });
  }

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

    const { error } = await api.datalist.create({ body: requestBody });

    if (error) {
      throw error;
    }
    toast.success("Datalist created successfully!");
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
        colDefs.updatedAt,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchDataLists}
      pageSizes={[10, 20, 50]}
      onRowClick={(row) => router.push(`/workspace/datalists/${row.id}`)}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.description,
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

export default DatalistsPage;
