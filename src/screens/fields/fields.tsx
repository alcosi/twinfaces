import { TwinClassResourceLink } from "@/entities/twinClass";
import { PagedResponse } from "@/shared/api";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { Fields_DETAILED, useFieldsSearchV1 } from "@/entities/fields";
import { FiltersState } from "@/shared/ui";
import { useFieldFilters } from "@/entities/fields/libs/hooks";
import { PermissionResourceLink } from "@/entities/permission";
import { FeaturerResourceLink } from "@/entities/featurer";

const colDefs: Record<
  keyof Pick<
    Fields_DETAILED,
    | "id"
    | "twinClassId"
    | "key"
    | "name"
    | "description"
    | "fieldTyperFeaturerId"
    | "viewPermissionId"
    | "editPermissionId"
    | "required"
  >,
  ColumnDef<Fields_DETAILED>
> = {
  id: {
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  twinClassId: {
    id: "twinClassId",
    accessorKey: "twinClassId",
    header: "Class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink data={original.twinClass} withTooltip />
        </div>
      ),
  },

  key: {
    accessorKey: "key",
    header: "Key",
  },

  name: {
    accessorKey: "name",
    header: "Name",
  },

  description: {
    accessorKey: "description",
    header: "Description",
  },

  fieldTyperFeaturerId: {
    accessorKey: "fieldTyperFeaturerId",
    header: "Field typer",
    cell: ({ row: { original } }) =>
      original.fieldTyperFeaturer && (
        <div className="max-w-48 inline-flex">
          <FeaturerResourceLink
            data={original.fieldTyperFeaturer}
            withTooltip
          />
        </div>
      ),
  },

  viewPermissionId: {
    accessorKey: "viewPermissionId",
    header: "View permission",
    cell: ({ row: { original } }) =>
      original.viewPermission && (
        <div className="max-w-48 column-flex space-y-2">
          <PermissionResourceLink data={original.viewPermission} withTooltip />
        </div>
      ),
  },

  editPermissionId: {
    accessorKey: "editPermissionId",
    header: "Edit permission",
    cell: ({ row: { original } }) =>
      original.editPermission && (
        <div className="max-w-48 column-flex space-y-2">
          <PermissionResourceLink data={original.editPermission} withTooltip />
        </div>
      ),
  },

  required: {
    accessorKey: "required",
    header: "Required",
    cell: (data) => <>{data.getValue() && <Check />}</>,
  },
};

export function Fields() {
  const tableRef = useRef<DataTableHandle>(null);
  const { buildFilterFields, mapFiltersToPayload } = useFieldFilters();
  const { searchFields } = useFieldsSearchV1();

  async function fetchFields(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<Fields_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      const response = await searchFields({
        pagination,
        filters: _filters,
      });

      return {
        data: response.data ?? [],
        pagination: response.pagination ?? {},
      };
    } catch (e) {
      toast.error("Failed to fetch fields");
      return { data: [], pagination: {} };
    }
  }

  return (
    <Experimental_CrudDataTable
      title="Fields"
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.twinClassId,
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.fieldTyperFeaturerId,
        colDefs.viewPermissionId,
        colDefs.editPermissionId,
        colDefs.required,
      ]}
      getRowId={(row) => row.key!}
      fetcher={fetchFields}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.twinClassId,
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.fieldTyperFeaturerId,
        colDefs.viewPermissionId,
        colDefs.editPermissionId,
        colDefs.required,
      ]}
    />
  );
}
