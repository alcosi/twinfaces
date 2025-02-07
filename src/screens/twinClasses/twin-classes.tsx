"use client";

import { ImageWithFallback } from "@/components/image-with-fallback";
import { DatalistResourceLink } from "@/entities/datalist";
import {
  TWIN_CLASSES_SCHEMA,
  TwinClass_DETAILED,
  TwinClassCreateRq,
  TwinClassFieldValues,
  TwinClassResourceLink,
  useTwinClassFilters,
  useTwinClassSearchV1,
} from "@/entities/twinClass";
import { useBreadcrumbs } from "@/features/breadcrumb";
import { ApiContext, PagedResponse } from "@/shared/api";
import { pluckProperty } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check, Unplug } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { TwinClassFormFields } from "./form-fields";
import { PermissionResourceLink } from "@/entities/permission";

const colDefs: Record<
  keyof Pick<
    TwinClass_DETAILED,
    | "logo"
    | "id"
    | "key"
    | "name"
    | "headClassId"
    | "extendsClassId"
    | "abstractClass"
    | "permissionSchemaSpace"
    | "twinflowSchemaSpace"
    | "twinClassSchemaSpace"
    | "description"
    | "aliasSpace"
    | "markersDataListId"
    | "tagsDataListId"
    | "viewPermissionId"
    | "createPermissionId"
    | "editPermissionId"
    | "deletePermissionId"
    | "ownerType"
  >,
  ColumnDef<TwinClass_DETAILED>
> = {
  logo: {
    id: "logo",
    accessorKey: "logo",
    header: "Logo",
    cell: (data) => {
      const value = data.row.original.logo;
      return (
        <ImageWithFallback
          src={value as string}
          alt={value as string}
          fallbackContent={<Unplug />}
          width={32}
          height={32}
          className="text-[0]"
        />
      );
    },
  },
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.row.original.id} />,
  },
  key: {
    id: "key",
    accessorKey: "key",
    header: "Key",
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row: { original } }) => (
      <div className="max-w-48 inline-flex">
        <TwinClassResourceLink data={original} withTooltip />
      </div>
    ),
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  headClassId: {
    id: "headClassId",
    accessorKey: "headClassId",
    header: "Head",
    cell: ({ row: { original } }) =>
      original.headClass ? (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.headClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ) : null,
  },
  extendsClassId: {
    id: "extendsClass.id",
    accessorKey: "extendsClass.id",
    header: "Extends",
    cell: ({ row: { original } }) =>
      original.extendsClass ? (
        <div className="max-w-48 inline-flex">
          <TwinClassResourceLink
            data={original.extendsClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ) : null,
  },
  abstractClass: {
    id: "abstractClass",
    accessorKey: "abstractClass",
    header: "Abstract",
    cell: (data) => data.getValue() && <Check />,
  },
  ownerType: {
    id: "ownerType",
    accessorKey: "ownerType",
    header: "Owner type",
  },
  permissionSchemaSpace: {
    id: "permissionSchemaSpace",
    accessorKey: "permissionSchemaSpace",
    header: "Permission Schema",
    cell: (data) => data.getValue() && <Check />,
  },
  twinflowSchemaSpace: {
    id: "twinflowSchemaSpace",
    accessorKey: "twinflowSchemaSpace",
    header: "Twinflow schema",
    cell: (data) => data.getValue() && <Check />,
  },
  twinClassSchemaSpace: {
    id: "twinClassSchemaSpace",
    accessorKey: "twinClassSchemaSpace",
    header: "Twinclass schema",
    cell: (data) => data.getValue() && <Check />,
  },
  aliasSpace: {
    id: "aliasSpace",
    accessorKey: "aliasSpace",
    header: "Alias space",
    cell: (data) => data.getValue() && <Check />,
  },
  markersDataListId: {
    id: "markersDataListId",
    accessorKey: "markersDataListId",
    header: "Markers list",
    cell: ({ row: { original } }) =>
      original.markerMap ? (
        <div className="max-w-48 inline-flex">
          <DatalistResourceLink data={original.markerMap} withTooltip />
        </div>
      ) : null,
  },
  tagsDataListId: {
    id: "tagsDataListId",
    accessorKey: "tagsDataListId",
    header: "Tags list",
    cell: ({ row: { original } }) =>
      original.tagMap ? (
        <div className="max-w-48 inline-flex">
          <DatalistResourceLink data={original.tagMap} withTooltip />
        </div>
      ) : null,
  },
  viewPermissionId: {
    id: "viewPermissionId",
    accessorKey: "viewPermissionId",
    header: "View permission",
    cell: ({ row: { original } }) =>
      original.viewPermission && (
        <div className="max-w-48 column-flex space-y-2">
          <PermissionResourceLink data={original.viewPermission} withTooltip />
        </div>
      ),
  },
  createPermissionId: {
    id: "createPermissionId",
    accessorKey: "createPermissionId",
    header: "Create permission",
    cell: ({ row: { original } }) =>
      original.createPermission && (
        <div className="max-w-48 column-flex space-y-2">
          <PermissionResourceLink
            data={original.createPermission}
            withTooltip
          />
        </div>
      ),
  },
  editPermissionId: {
    id: "editPermissionId",
    accessorKey: "editPermissionId",
    header: "Edit permission",
    cell: ({ row: { original } }) =>
      original.editPermission && (
        <div className="max-w-48 column-flex space-y-2">
          <PermissionResourceLink data={original.editPermission} withTooltip />
        </div>
      ),
  },
  deletePermissionId: {
    id: "deletePermissionId",
    accessorKey: "deletePermissionId",
    header: "Delete permission",
    cell: ({ row: { original } }) =>
      original.deletePermission && (
        <div className="max-w-48 column-flex space-y-2">
          <PermissionResourceLink
            data={original.deletePermission}
            withTooltip
          />
        </div>
      ),
  },
};

export function TwinClasses() {
  const api = useContext(ApiContext);
  const router = useRouter();
  const tableRef = useRef<DataTableHandle>(null);
  const { searchTwinClasses } = useTwinClassSearchV1();
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFilters();
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([{ label: "Classes", href: "/workspace/twinclass" }]);
  }, []);

  async function fetchTwinClasses(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinClass_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchTwinClasses({
        pagination,
        filters: _filters,
      });
    } catch (error) {
      toast.error("Failed to fetch twin classes");
      return { data: [], pagination: {} };
    }
  }

  const twinClassesForm = useForm<TwinClassFieldValues>({
    resolver: zodResolver(TWIN_CLASSES_SCHEMA),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      abstractClass: false,
      headTwinClass: null,
      headHunterFeaturer: {},
      extendsTwinClassId: null,
      logo: "",
      permissionSchemaSpace: false,
      twinflowSchemaSpace: false,
      twinClassSchemaSpace: false,
      aliasSpace: false,
      markerDataListId: "",
      tagDataListId: "",
      viewPermissionId: "",
      createPermissionId: "",
      editPermissionId: "",
      deletePermissionId: "",
      autoCreatePermissions: true,
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof TWIN_CLASSES_SCHEMA>
  ) => {
    const {
      name,
      description,
      headTwinClass,
      headHunterFeaturer,
      extendsTwinClassId,
      ...rest
    } = formValues;

    const requestBody: TwinClassCreateRq = {
      ...rest,
      extendsTwinClassId: extendsTwinClassId ?? "",
      headTwinClassId: headTwinClass?.[0]?.id,
      headHunterFeaturerId: headHunterFeaturer?.id,
      headHunterParams: headHunterFeaturer?.params
        ? pluckProperty(headHunterFeaturer.params, "value")
        : {},
      nameI18n: {
        translationInCurrentLocale: name,
        translations: {},
      },
      descriptionI18n: description
        ? {
            translationInCurrentLocale: description,
            translations: {},
          }
        : undefined,
      viewPermissionId: formValues.viewPermissionId,
      createPermissionId: formValues.createPermissionId,
      editPermissionId: formValues.editPermissionId,
      deletePermissionId: formValues.deletePermissionId,
    };

    const { error } = await api.twinClass.create({ body: requestBody });

    if (error) {
      throw error;
    }
    toast.success("Twin class created successfully!");
  };

  return (
    <main className={"p-8 lg:flex lg:justify-center flex-col mx-auto"}>
      <CrudDataTable
        ref={tableRef}
        fetcher={fetchTwinClasses}
        onRowClick={(row) => router.push(`/workspace/twinclass/${row.id}`)}
        columns={[
          colDefs.logo,
          colDefs.id,
          colDefs.key,
          colDefs.name,
          colDefs.description,
          colDefs.headClassId,
          colDefs.extendsClassId,
          colDefs.abstractClass,
          colDefs.ownerType,
          colDefs.permissionSchemaSpace,
          colDefs.twinflowSchemaSpace,
          colDefs.twinClassSchemaSpace,
          colDefs.aliasSpace,
          colDefs.markersDataListId,
          colDefs.tagsDataListId,
          colDefs.viewPermissionId,
          colDefs.createPermissionId,
          colDefs.editPermissionId,
          colDefs.deletePermissionId,
        ]}
        getRowId={(row) => row.id!}
        pageSizes={[10, 20, 50]}
        filters={{
          filtersInfo: buildFilterFields(),
        }}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.key,
          colDefs.name,
          colDefs.headClassId,
          colDefs.extendsClassId,
          colDefs.abstractClass,
          colDefs.markersDataListId,
          colDefs.tagsDataListId,
        ]}
        dialogForm={twinClassesForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <TwinClassFormFields control={twinClassesForm.control} />
        )}
      />
    </main>
  );
}
