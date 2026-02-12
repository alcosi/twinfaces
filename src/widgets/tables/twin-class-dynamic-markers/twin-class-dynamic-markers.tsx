import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { toast } from "sonner";

import { DataListOption_DETAILED } from "@/entities/datalist-option";
import {
  TwinClassDynamicMarker_DETAILED,
  TwinClass_DETAILED,
  useTwinClassDynamicMarkerSearch,
} from "@/entities/twin-class";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse } from "@/shared/api";
import { reduceToObject, toArray } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    TwinClassDynamicMarker_DETAILED,
    "id" | "twinClass" | "twinValidatorSetId" | "markerDataListOption"
  >,
  ColumnDef<TwinClassDynamicMarker_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  twinClass: {
    id: "twinClass",
    accessorKey: "twinClass",
    header: "Class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.twinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  twinValidatorSetId: {
    id: "twinValidatorSetId",
    accessorKey: "twinValidatorSetId",
    header: "Validator set",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  //TODO When there is a fix from the backend, we will need to check (perhaps add a new show mode)
  markerDataListOption: {
    id: "markerDataListOption",
    accessorKey: "markerDataListOption",
    header: "Marker",
    cell: ({ row: { original } }) =>
      original.markerDataListOption && (
        <div className="inline-flex max-w-48">
          <DatalistOptionResourceLink
            data={original.markerDataListOption as DataListOption_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
};

export function TwinClassDynamicMarkersTable({
  twinClassId,
}: {
  twinClassId?: string;
}) {
  const { searchTwinClassDynamicMarker } = useTwinClassDynamicMarkerSearch();

  async function fetchTwinClassDynamicMarkers(
    pagination: PaginationState,
    filters?: FiltersState
  ): Promise<PagedResponse<TwinClassDynamicMarker_DETAILED>> {
    try {
      return await searchTwinClassDynamicMarker({
        pagination,
        filters: {
          twinClassIdMap: twinClassId
            ? reduceToObject({ list: toArray(twinClassId), defaultValue: true })
            : undefined,
        },
      });
    } catch {
      toast.error("Failed to fetch twin class dynamic markers");

      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        colDefs.twinClass,
        colDefs.twinValidatorSetId,
        colDefs.markerDataListOption,
      ]}
      fetcher={fetchTwinClassDynamicMarkers}
      getRowId={(row) => row.id}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.twinClass,
        colDefs.twinValidatorSetId,
        colDefs.markerDataListOption,
      ]}
    />
  );
}
