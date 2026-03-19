"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { toast } from "sonner";

import {
  OptionProjection_DETAILED,
  useOptionProjectionSearch,
} from "@/entities/option-projection";
import { DatalistOptionResourceLink } from "@/features/datalist-option/ui";
import { DatalistResourceLink } from "@/features/datalist/ui";
import { ProjectionTypeResourceLink } from "@/features/projection-type/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

const colDefs: Record<
  keyof Pick<
    OptionProjection_DETAILED,
    | "id"
    | "projectionType"
    | "dstDataListOption"
    | "dstDataList"
    | "srcDataListOption"
    | "srcDataList"
    | "savedByUser"
    | "changedAt"
  >,
  ColumnDef<OptionProjection_DETAILED>
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
    header: "Type",
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

  dstDataListOption: {
    id: "dstDataListOption",
    accessorKey: "dstDataListOption",
    header: "Dst option",
    cell: ({ row: { original } }) =>
      original.dstDataListOption && (
        <div className="inline-flex max-w-48">
          <DatalistOptionResourceLink
            data={original.dstDataListOption}
            withTooltip
          />
        </div>
      ),
  },

  dstDataList: {
    id: "dstDataList",
    accessorKey: "dstDataList",
    header: "Dsc data list",
    cell: ({ row: { original } }) =>
      original.dstDataList && (
        <div className="inline-flex max-w-48">
          <DatalistResourceLink data={original.dstDataList} withTooltip />
        </div>
      ),
  },

  srcDataListOption: {
    id: "srcDataListOption",
    accessorKey: "srcDataListOption",
    header: "Src option",
    cell: ({ row: { original } }) =>
      original.srcDataListOption && (
        <div className="inline-flex max-w-48">
          <DatalistOptionResourceLink
            data={original.srcDataListOption}
            withTooltip
          />
        </div>
      ),
  },

  srcDataList: {
    id: "srcDataList",
    accessorKey: "srcDataList",
    header: "Src data list",
    cell: ({ row: { original } }) =>
      original.srcDataList && (
        <div className="inline-flex max-w-48">
          <DatalistResourceLink data={original.srcDataList} withTooltip />
        </div>
      ),
  },

  savedByUser: {
    id: "savedByUser",
    accessorKey: "savedByUser",
    header: "Saved by user",
    cell: ({ row: { original } }) =>
      original.savedByUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.savedByUser} withTooltip />
        </div>
      ),
  },

  changedAt: {
    id: "changedAt",
    accessorKey: "changedAt",
    header: "Changed at",
    cell: ({ row: { original } }) =>
      original.changedAt &&
      original.changedAt &&
      formatIntlDate(original.changedAt, "datetime-local"),
  },
};
export function OptionProjectionsScreen() {
  const { searchOptionProjection } = useOptionProjectionSearch();

  async function fetchOptionsProjection(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<OptionProjection_DETAILED>> {
    try {
      return await searchOptionProjection({
        pagination,
        filters: {},
      });
    } catch (error) {
      toast.error(
        "An error occurred while fetching option projections: " + error
      );
      throw error;
    }
  }
  return (
    <CrudDataTable
      title="Option projections"
      className="mx-auto mb-10 flex-col p-8 lg:flex lg:justify-center"
      columns={[
        colDefs.id,
        colDefs.projectionType,
        colDefs.srcDataList,
        colDefs.srcDataListOption,
        colDefs.dstDataList,
        colDefs.dstDataListOption,
        colDefs.savedByUser,
        colDefs.changedAt,
      ]}
      fetcher={fetchOptionsProjection}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.projectionType,
        colDefs.srcDataList,
        colDefs.srcDataListOption,
        colDefs.dstDataList,
        colDefs.dstDataListOption,
        colDefs.savedByUser,
        colDefs.changedAt,
      ]}
    />
  );
}
