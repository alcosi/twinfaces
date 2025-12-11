import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import { Featurer_DETAILED } from "@/entities/featurer";
import {
  Projection_DETAILED,
  useProjectionsSearch,
} from "@/entities/projection";
import { useProjectionFilters } from "@/entities/projection/libs";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { ProjectionTypeResourceLink } from "@/features/projection-type/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    Projection_DETAILED,
    | "id"
    | "projectionType"
    | "srcTwinClassField"
    | "dstTwinClass"
    | "dstTwinClassField"
    | "fieldProjectorFeaturer"
  >,
  ColumnDef<Projection_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  projectionType: {
    id: "projectionType",
    accessorKey: "projectionType",
    header: "Projection type",
    cell: ({ row: { original } }) =>
      original.projectionType && (
        <div className="inline-flex max-w-48">
          <ProjectionTypeResourceLink
            data={original.projectionType}
            withTooltip
          />
        </div>
      ),
  },
  srcTwinClassField: {
    id: "srcTwinClassField",
    accessorKey: "srcTwinClassField",
    header: "Src field",
    cell: ({ row: { original } }) =>
      original.srcTwinClassField && (
        <div className="inline-flex max-w-48">
          <TwinClassFieldResourceLink
            data={original.srcTwinClassField}
            withTooltip
          />
        </div>
      ),
  },
  dstTwinClass: {
    id: "dstTwinClass",
    accessorKey: "dstTwinClass",
    header: "Dst class",
    cell: ({ row: { original } }) =>
      original.dstTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink data={original.dstTwinClass} withTooltip />
        </div>
      ),
  },
  dstTwinClassField: {
    id: "dstTwinClassField",
    accessorKey: "dstTwinClassField",
    header: "Dst field",
    cell: ({ row: { original } }) =>
      original.dstTwinClassField && (
        <div className="inline-flex max-w-48">
          <TwinClassFieldResourceLink
            data={original.dstTwinClassField}
            withTooltip
          />
        </div>
      ),
  },
  fieldProjectorFeaturer: {
    id: "fieldProjectorFeaturer",
    accessorKey: "fieldProjectorFeaturer",
    header: "Projector",
    cell: ({ row: { original } }) =>
      original.fieldProjectorFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.fieldProjectorFeaturer as Featurer_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
};

export function ProjectionsTable() {
  const { searchProjections } = useProjectionsSearch();
  const { buildFilterFields, mapFiltersToPayload } = useProjectionFilters({
    enabledFilters: undefined,
  });

  async function fetchProjections(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchProjections({
        pagination,
        filters: {
          ..._filters,
        },
      });
    } catch (error) {
      toast.error("An error occured while fetching projections: " + error);
      throw new Error("An error occured while fetching projections: " + error);
    }
  }

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.projectionType,
        colDefs.srcTwinClassField,
        colDefs.dstTwinClass,
        colDefs.dstTwinClassField,
        colDefs.fieldProjectorFeaturer,
      ]}
      fetcher={fetchProjections}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.projectionType,
        colDefs.srcTwinClassField,
        colDefs.dstTwinClass,
        colDefs.dstTwinClassField,
        colDefs.fieldProjectorFeaturer,
      ]}
      title="Projections"
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
