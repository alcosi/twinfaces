"use client";

import { DatalistOptionResourceLink } from "@/entities/datalist-option";
import {
  Twin,
  TWIN_SCHEMA,
  TwinCreateRq,
  TwinFormValues,
  TwinResourceLink,
  useCreateTwin,
  useTwinFilters,
  useTwinSearchV3,
} from "@/entities/twin";
import {
  TwinClassStatusResourceLink,
  TwinStatus,
} from "@/entities/twin-status";
import {
  TwinClass_DETAILED,
  TwinClassResourceLink,
} from "@/entities/twinClass";
import { User, UserResourceLink } from "@/entities/user";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { PagedResponse } from "@/shared/api";
import { formatToTwinfaceDate, isPopulatedArray } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TwinFormFields } from "./form-fields";

const colDefs: Record<
  keyof Pick<
    Twin,
    | "id"
    | "twinClassId"
    | "name"
    | "statusId"
    | "description"
    | "authorUserId"
    | "assignerUserId"
    | "headTwinId"
    | "tags"
    | "markers"
    | "createdAt"
    | "aliases"
  >,
  ColumnDef<Twin>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.row.original.id} />,
  },

  twinClassId: {
    id: "twinClassId",
    accessorKey: "twinClassId",
    header: "Twin class",
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.twinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },

  aliases: {
    id: "aliases",
    accessorKey: "aliases",
    header: "Alias",
  },

  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },

  statusId: {
    id: "statusId",
    accessorKey: "statusId",
    header: "Status",
    cell: ({ row: { original } }) =>
      original.status && (
        <div className="max-w-48 inline-flex">
          <TwinClassStatusResourceLink
            data={original.status as TwinStatus}
            twinClassId={original.twinClassId!}
            withTooltip
          />
        </div>
      ),
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },

  authorUserId: {
    id: "authorUserId",
    accessorKey: "authorUserId",
    header: "Author",
    cell: ({ row: { original } }) =>
      original.authorUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.authorUser as User} withTooltip />
        </div>
      ),
  },

  assignerUserId: {
    id: "assignerUserId",
    accessorKey: "assignerUserId",
    header: "Assignee",
    cell: ({ row: { original } }) =>
      original.assignerUser && (
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.assignerUser as User} withTooltip />
        </div>
      ),
  },

  headTwinId: {
    id: "headTwinId",
    accessorKey: "headTwinId",
    header: "Head",
    cell: ({ row: { original } }) =>
      original.headTwinId && original.headTwin ? (
        <div className="max-w-48 inline-flex">
          <TwinResourceLink data={original.headTwin} withTooltip />
        </div>
      ) : null,
  },

  tags: {
    id: "tags",
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row: { original } }) =>
      isPopulatedArray(original.tags) && (
        <div className="max-w-48 inline-flex flex-wrap gap-2">
          {original.tags.map((tag) => (
            <DatalistOptionResourceLink key={tag.id} data={tag} />
          ))}
        </div>
      ),
  },

  markers: {
    id: "markers",
    accessorKey: "markers",
    header: "Markers",
    cell: ({ row: { original } }) =>
      original.markerIdList && original.markers ? (
        <div className="max-w-48 inline-flex">
          <DatalistOptionResourceLink
            data={{
              ...original.markers,
              dataListId: original.twinClass?.markersDataListId,
            }}
            withTooltip
          />
        </div>
      ) : null,
  },

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function TwinsScreen() {
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { buildFilterFields, mapFiltersToPayload } = useTwinFilters();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { searchTwins } = useTwinSearchV3();
  const { createTwin } = useCreateTwin();

  useEffect(() => {
    setBreadcrumbs([{ label: "Twins", href: "/workspace/twins" }]);
  }, []);

  const form = useForm<TwinFormValues>({
    resolver: zodResolver(TWIN_SCHEMA),
    defaultValues: {
      classId: "",
      name: "",
      description: "",
    },
  });

  async function fetchTwin({
    pagination,
    filters,
  }: {
    pagination?: PaginationState;
    filters: FiltersState;
  }): Promise<PagedResponse<Twin>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchTwins({
        pagination: pagination,
        filters: _filters,
      });
    } catch (e) {
      toast.error("Failed to fetch twins");
      return { data: [], pagination: {} };
    }
  }

  async function handleOnCreateSubmit(formValues: z.infer<typeof TWIN_SCHEMA>) {
    const body: TwinCreateRq = { ...formValues };
    await createTwin({
      body: {
        ...body,
        assignerUserId: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
      },
    });
    toast.success(`Twin ${body.name} is created successfully!`);
  }

  return (
    <CrudDataTable
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.aliases,
        colDefs.twinClassId,
        colDefs.name,
        colDefs.statusId,
        colDefs.description,
        colDefs.authorUserId,
        colDefs.assignerUserId,
        colDefs.headTwinId,
        colDefs.tags,
        colDefs.markers,
        colDefs.createdAt,
      ]}
      getRowId={(row) => row.id!}
      fetcher={(pagination, filters) => fetchTwin({ pagination, filters })}
      pageSizes={[10, 20, 50]}
      onRowClick={(row) => router.push(`/workspace/twins/${row.id}`)}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.aliases,
        colDefs.twinClassId,
        colDefs.name,
        colDefs.statusId,
        colDefs.description,
        colDefs.authorUserId,
        colDefs.assignerUserId,
        colDefs.headTwinId,
        colDefs.tags,
        colDefs.markers,
        colDefs.createdAt,
      ]}
      dialogForm={form}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => <TwinFormFields control={form.control} />}
    />
  );
}
