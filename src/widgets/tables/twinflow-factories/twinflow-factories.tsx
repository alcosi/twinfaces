"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
//import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  TwinFlowFactory_DETAILED,
  useTwinFlowFactoryFilters,
  useTwinFlowFactorySearch,
} from "@/entities/twinflow-factory";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinFlowResourceLink } from "@/features/twin-flow/ui";
//import { PlatformArea } from "@/shared/config";
import { isFalsy, isTruthy, toArray, toArrayOfString } from "@/shared/libs";
import { Badge, GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    TwinFlowFactory_DETAILED,
    "id" | "twinflowId" | "twinFactoryLauncherId" | "factoryId"
  >,
  ColumnDef<TwinFlowFactory_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  twinflowId: {
    id: "twinflowId",
    accessorKey: "twinflowId",
    header: "Twinflow",
    cell: ({ row: { original } }) =>
      original.twinflow ? (
        <div className="inline-flex max-w-48">
          <TwinFlowResourceLink data={original.twinflow} withTooltip />
        </div>
      ) : (
        "-"
      ),
  },
  twinFactoryLauncherId: {
    accessorKey: "twinFactoryLauncherId",
    header: "Launcher",
    cell: ({ row: { original } }) => (
      <Badge variant="outline">{original.twinFactoryLauncherId}</Badge>
    ),
  },
  factoryId: {
    id: "factoryId",
    accessorKey: "factoryId",
    header: "Factory",
    cell: ({ row: { original } }) =>
      original.factory ? (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ) : (
        "-"
      ),
  },
};

export function TwinFlowFactoriesTable({
  twinflowId,
  title,
}: {
  twinflowId?: string;
  title?: string;
}) {
  //const router = useRouter();
  const { searchTwinFlowFactories } = useTwinFlowFactorySearch();
  const { buildFilterFields, mapFiltersToPayload } = useTwinFlowFactoryFilters({
    enabledFilters: isTruthy(twinflowId)
      ? ["idSet", "factoryIdSet", "factoryLauncherSet"]
      : undefined,
  });

  async function fetchTwinflowFactories(
    pagination: PaginationState,
    params: { search?: string; filters: FiltersState["filters"] }
  ) {
    const _filters = mapFiltersToPayload(params.filters);

    try {
      return await searchTwinFlowFactories({
        pagination,
        filters: {
          ..._filters,
          twinflowIdSet: twinflowId
            ? toArrayOfString(toArray(twinflowId), "id")
            : _filters.twinflowIdSet,
        },
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching twinflow factories: " + error
      );
      throw new Error(
        "An error occured while fetching twinflow factories: " + error
      );
    }
  }

  return (
    <CrudDataTable
      title={title || "Twinflow Factories"}
      columns={[
        colDefs.id,
        ...(isFalsy(twinflowId) ? [colDefs.twinflowId] : []),
        colDefs.twinFactoryLauncherId,
        colDefs.factoryId,
      ]}
      fetcher={fetchTwinflowFactories}
      getRowId={(row) => row.id}
      // TODO: add detailed twinflow factory page
      // onRowClick={(row) =>
      //   router.push(`/${PlatformArea.core}/twinflow-factories/${row.id}`)
      // }
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(twinflowId) ? [colDefs.twinflowId] : []),
        colDefs.twinFactoryLauncherId,
        colDefs.factoryId,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
    />
  );
}
