"use client";

import {
  Factory,
  useFactoryFilters,
  useFactorySearch,
} from "@/entities/factory";
import { UserResourceLink } from "@/entities/user";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate } from "@/shared/libs";
import { FiltersState, GuidWithCopy } from "@/shared/ui";
import { Experimental_CrudDataTable } from "@/widgets/crud-data-table";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const colDefs: Record<
  keyof Omit<Factory, "createdByUserId">,
  ColumnDef<Factory>
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
    header: "Key",
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
  createdByUser: {
    id: "createdByUser",
    accessorKey: "createdByUser",
    header: "Created By",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <UserResourceLink data={original.createdByUser} />
      ),
  },
  factoryBranchesCount: {
    id: "factoryBranchesCount",
    accessorKey: "factoryBranchesCount",
    header: "Branches",
  },
  factoryUsagesCount: {
    id: "factoryUsagesCount",
    accessorKey: "factoryUsagesCount",
    header: "Usages",
  },
  factoryErasersCount: {
    id: "factoryErasersCount",
    accessorKey: "factoryErasersCount",
    header: "Erasers",
  },
  factoryMultipliersCount: {
    id: "factoryMultipliersCount",
    accessorKey: "factoryMultipliersCount",
    header: "Multipliers",
  },
  factoryPipelinesCount: {
    id: "factoryPipelinesCount",
    accessorKey: "factoryPipelinesCount",
    header: "Pipelines",
  },
};

export function Factories() {
  const { searchFactories } = useFactorySearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryFilters();
  const router = useRouter();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Factories", href: "/workspace/factories" }]);
  }, []);

  async function fetchFactories(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<Factory>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactories({
        pagination,
        filters: _filters,
      });
    } catch (error) {
      toast.error("An error occurred while fetching factories: " + error);
      throw error;
    }
  }

  return (
    <Experimental_CrudDataTable
      className="mb-10 p-8 lg:flex lg:justify-center flex-col mx-auto"
      columns={Object.values(colDefs) as ColumnDef<Factory>[]}
      fetcher={fetchFactories}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.factoryUsagesCount,
      ]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      onRowClick={(row) => {
        router.push(`/workspace/factories/${row.id}`);
      }}
    />
  );
}
