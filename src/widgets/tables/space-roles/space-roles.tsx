"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  SPACE_ROLE_SHEMA,
  SpaceRole_DETAILED,
  useSpaceRoleCreate,
  useSpaceRoleSearch,
} from "@/entities/space-role";
import { useSpaceRoleFilters } from "@/entities/space-role/libs";
import { TwinClassContext } from "@/entities/twin-class";
import { BusinessAccountResourceLink } from "@/features/business-account/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isTruthy } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
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
    header: "Key",
    cell: (data) => data.getValue<string>(),
  },
  twinClass: {
    id: "twinClass",
    accessorKey: "twinClass",
    header: "Twin class",
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
    header: "Business account",
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
    header: "Name",
    cell: (data) => data.getValue<string>(),
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: (data) => data.getValue<string>(),
  },
};

export function SpaceRolesTable({ title }: { title?: string }) {
  const { searchSpaceRole } = useSpaceRoleSearch();
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

  async function fetchSpaceRoles(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<SpaceRole_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchSpaceRole({
        pagination,
        filters: {
          ..._filters,
          twinClassIdList: twinClass?.id
            ? [twinClass?.id]
            : _filters.twinClassIdList,
        },
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

  return (
    <CrudDataTable
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
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/space-roles/${row.id}`)
      }
      dialogForm={spaceRoleForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <SpaceRolesFormFields control={spaceRoleForm.control} />
      )}
    />
  );
}
