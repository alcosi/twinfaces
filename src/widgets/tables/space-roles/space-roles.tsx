"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  SPACE_ROLE_SHEMA,
  SpaceRoleFilterKeys,
  SpaceRole_DETAILED,
  useSpaceRoleCount,
  useSpaceRoleCreate,
  useSpaceRoleSearch,
} from "@/entities/space-role";
import { useSpaceRoleFilters } from "@/entities/space-role/libs";
import { TwinClassContext } from "@/entities/twin-class";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isTruthy } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import {
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
} from "../../crud-data-table";
import { SpaceRolesFormFields } from "./form-fields";

const colDefs: Record<
  "id" | "key" | "twinClass" | "businessAccountId" | "name" | "description",
  ColumnDef<SpaceRole_DETAILED>
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
    header: () => <SortableHeader title="Key" sortField="key" />,
    cell: (data) => data.getValue<string>(),
  },
  twinClass: {
    id: "twinClass",
    accessorKey: "twinClass",
    header: () => (
      <SortableHeader title="Twin class" sortField="twinClassName" />
    ),
    cell: ({ row: { original } }) =>
      original.twinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink data={original.twinClass} withTooltip />
        </div>
      ),
  },
  businessAccountId: {
    id: "businessAccountId",
    accessorKey: "businessAccountId",
    header: () => (
      <SortableHeader
        title="Business account"
        sortField="businessAccountName"
      />
    ),
    cell: ({ row: { original } }) =>
      original.businessAccount && (
        <div className="inline-flex max-w-48">
          <BusinessAccountResourceLink
            data={original.businessAccount}
            withTooltip
          />
        </div>
      ),
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: () => <SortableHeader title="Name" sortField="name" />,
    cell: (data) => data.getValue<string>(),
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: () => (
      <SortableHeader title="Description" sortField="description" />
    ),
    cell: (data) => data.getValue<string>(),
  },
};

export function SpaceRolesTable({ title }: { title?: string }) {
  const { searchSpaceRole } = useSpaceRoleSearch();
  const { countSpaceRoles } = useSpaceRoleCount();
  const { createSpaceRole } = useSpaceRoleCreate();
  const { twinClass } = useContext(TwinClassContext);
  const { buildFilterFields, mapFiltersToPayload } = useSpaceRoleFilters({
    enabledFilters: isTruthy(twinClass?.id)
      ? [
          "idList",
          "keyLikeList",
          "businessAccountIdList",
          "nameI18nLikeList",
          "descriptionI18nLikeList",
        ]
      : undefined,
  });
  const router = useRouter();

  const spaceRoleForm = useForm<z.infer<typeof SPACE_ROLE_SHEMA>>({
    resolver: zodResolver(SPACE_ROLE_SHEMA),
    defaultValues: {
      key: "",
      twinClassId: twinClass?.id || "",
      businessAccountId: "",
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof SPACE_ROLE_SHEMA>
  ) => {
    const { name, description, ...rest } = formValues;

    await createSpaceRole({
      body: {
        spaceRoles: [
          {
            ...rest,
            nameI18n: {
              translationInCurrentLocale: name,
              translations: {},
            },
            descriptionI18n: {
              translationInCurrentLocale: description,
              translations: {},
            },
          },
        ],
      },
    });

    toast.success("Space role created successfully!");
  };

  // Maps the table filter values to the API payload and pins the contextual
  // twin class when the table is embedded in one. Shared by the fetcher and the
  // pie-chart count requests so both honour the active filters.
  const resolveFilters = useCallback(
    (rawFilters: Record<SpaceRoleFilterKeys, unknown>) => {
      const mapped = mapFiltersToPayload(rawFilters);

      return {
        ...mapped,
        twinClassIdList: twinClass?.id
          ? [twinClass.id]
          : mapped.twinClassIdList,
      };
    },
    [mapFiltersToPayload, twinClass?.id]
  );

  async function fetchSpaceRoles(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<SpaceRole_DETAILED>> {
    try {
      const response = await searchSpaceRole({
        pagination,
        filters: resolveFilters(
          filters.filters as Record<SpaceRoleFilterKeys, unknown>
        ),
        sort,
      });
      return {
        data: response.data ?? [],
        pagination: response.pagination ?? {},
      };
    } catch (error) {
      toast.error("An error occured while fetching space roles: " + error);
      throw new Error("An error occured while fetching space roles: " + error);
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/space_role/count/v1), bound to the active filters.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = resolveFilters(
        filters as Record<SpaceRoleFilterKeys, unknown>
      );
      const groupings: ChartGrouping[] = [];

      // Scoped to one twin class, that column is a constant and carries no
      // information — same reason it is dropped from the filters.
      if (!twinClass?.id) {
        groupings.push({
          key: "twinClass",
          label: "Twin class",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countSpaceRoles({
                filters: resolved,
                groupField: "twinClassId",
                offset,
                limit,
              }),
            (g) => g.twinClassId,
            (g) => g.twinClass?.name,
            (g) =>
              g.twinClass && (
                <TwinClassResourceLink data={g.twinClass} withTooltip />
              )
          ),
        });
      }

      groupings.push({
        key: "businessAccount",
        label: "Business account",
        load: buildCountGroupingLoad(
          ({ offset, limit }) =>
            countSpaceRoles({
              filters: resolved,
              groupField: "businessAccountId",
              offset,
              limit,
            }),
          (g) => g.businessAccountId,
          (g) => g.businessAccount?.name,
          (g) =>
            g.businessAccount && (
              <BusinessAccountResourceLink
                data={g.businessAccount}
                withTooltip
              />
            )
        ),
      });

      return groupings;
    },
    [resolveFilters, countSpaceRoles, twinClass?.id]
  );

  return (
    <CrudDataTable
      permissionSegment="space-roles"
      title={title ?? "Space roles"}
      columns={[
        colDefs.id,
        colDefs.key,
        colDefs.twinClass,
        colDefs.businessAccountId,
        colDefs.name,
        colDefs.description,
      ]}
      fetcher={fetchSpaceRoles}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.twinClass,
        colDefs.businessAccountId,
        colDefs.name,
        colDefs.description,
      ]}
      getRowId={(row) => row.id!}
      filters={{ filtersInfo: buildFilterFields() }}
      chartGroupings={buildChartGroupings}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/space-roles/${row.id}`)
      }
      getRowHref={(row) => `/${PlatformArea.core}/space-roles/${row.id}`}
      dialogForm={spaceRoleForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <SpaceRolesFormFields control={spaceRoleForm.control} />
      )}
    />
  );
}
