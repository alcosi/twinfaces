"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  ValidatorSet_DETAILED,
  useValidatorSetSearch,
} from "@/entities/validator-set";
import { useValidatorSetFilters } from "@/entities/validator-set/libs";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

const colDefs: Record<
  "id" | "name" | "description" | "invert",
  ColumnDef<ValidatorSet_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
  },
  invert: {
    id: "invert",
    accessorKey: "invert",
    header: "Invert",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function ValidatorSetsScreen() {
  const router = useRouter();
  const { searchValidatorSets } = useValidatorSetSearch();
  const { buildFilterFields, mapFiltersToPayload } = useValidatorSetFilters();

  async function fetchValidatorSets(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<ValidatorSet_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      return await searchValidatorSets({
        pagination,
        filters: {
          ..._filters,
        },
      });
    } catch (error) {
      toast.error("An error occured while fetching validator sets: " + error);
      throw new Error(
        "An error occured while fetching validator sets: " + error
      );
    }
  }

  return (
    <CrudDataTable
      title="Validator Sets"
      columns={[colDefs.id, colDefs.name, colDefs.description, colDefs.invert]}
      fetcher={fetchValidatorSets}
      getRowId={(row) => row.id}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/validator-sets/${row.id}`)
      }
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.invert,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
