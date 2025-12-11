import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import {
  Projection_DETAILED,
  useProjectionsSearch,
} from "@/entities/projection";
import { ProjectionTypeResourceLink } from "@/features/projection-type/ui";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<Projection_DETAILED, "id" | "projectionType">,
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
};

export function ProjectionsTable() {
  const { searchProjections } = useProjectionsSearch();

  async function fetchProjections(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    try {
      return await searchProjections({
        pagination,
        filters: {},
      });
    } catch (error) {
      toast.error("An error occured while fetching projections: " + error);
      throw new Error("An error occured while fetching projections: " + error);
    }
  }

  return (
    <CrudDataTable
      columns={[colDefs.id, colDefs.projectionType]}
      fetcher={fetchProjections}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[colDefs.id, colDefs.projectionType]}
      title="Projections"
    />
  );
}
