import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Featurer_DETAILED } from "@/entities/featurer";
import {
  TwinTrigger_DETAILED,
  useTwinTriggerFilters,
  useTwinTriggerSearch,
} from "@/entities/twin-trigger";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    TwinTrigger_DETAILED,
    | "id"
    | "triggerFeaturer"
    | "active"
    | "name"
    | "description"
    | "jobTwinClass"
  >,
  ColumnDef<TwinTrigger_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  triggerFeaturer: {
    id: "triggerFeaturer",
    accessorKey: "triggerFeaturer",
    header: "Twin trigger featurer",
    cell: ({ row: { original } }) =>
      original.triggerFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.triggerFeaturer as Featurer_DETAILED}
            params={original.triggerDetailedParams}
            withTooltip
          />
        </div>
      ),
  },
  jobTwinClass: {
    id: "jobTwinClass",
    accessorKey: "jobTwinClass",
    header: "Job class",
    cell: ({ row: { original } }) =>
      original.jobTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink data={original.jobTwinClass} withTooltip />
        </div>
      ),
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
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
};

export function TwinTriggersTable() {
  const router = useRouter();
  const { searchTwinTriggers } = useTwinTriggerSearch();
  const { buildFilterFields, mapFiltersToPayload } = useTwinTriggerFilters({});

  async function fetchTwinTriggers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinTrigger_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchTwinTriggers({
        pagination,
        filters: _filters,
      });
    } catch (error) {
      toast.error("An error occured while fetching twin triggers: " + error);
      throw new Error(
        "An error occured while fetching twin triggers: " + error
      );
    }
  }

  return (
    <CrudDataTable
      title="Twin triggers"
      columns={[
        colDefs.id,
        colDefs.triggerFeaturer,
        colDefs.jobTwinClass,
        colDefs.active,
        colDefs.name,
        colDefs.description,
      ]}
      fetcher={fetchTwinTriggers}
      getRowId={(row) => row.id!}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/twin-triggers/${row.id}`)
      }
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.triggerFeaturer,
        colDefs.jobTwinClass,
        colDefs.active,
        colDefs.name,
        colDefs.description,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
