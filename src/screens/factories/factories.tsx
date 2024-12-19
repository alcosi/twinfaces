"use client";

import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Factory } from "@/entities/factory";
import { FiltersState, GuidWithCopy } from "@/shared/ui";
import { UserResourceLink } from "@/entities/user";
import { useContext } from "react";
import { ApiContext, PagedResponse } from "@/shared/api";
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
  const api = useContext(ApiContext);

  async function fetchFactories(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<Factory>> {
    try {
      const response = await api.factory.search({
        pagination,
        filters: filters as any,
      });

      if (!response.data) {
        throw new Error("No data returned in a successful response");
      }

      return {
        data: response.data.factories ?? [],
        pagination: response.data.pagination ?? {},
      };
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch factories");
      return {
        data: [],
        pagination: {},
      };
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
    />
  );
}
