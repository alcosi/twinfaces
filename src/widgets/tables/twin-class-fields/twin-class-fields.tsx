import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  TwinClassFieldCreateRq,
  TwinClassFieldV1_DETAILED,
  useTwinClassFieldFilters,
  useTwinClassFieldSearch,
} from "@/entities/twin-class-field";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isTruthy, reduceToObject, toArray } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { TWIN_CLASS_FIELD_SCHEMA } from "./constants";
import { TwinClassFieldFormFields } from "./form-fields";
import { TwinClassFieldFormValues } from "./types";

const colDefs: Record<
  keyof Pick<
    TwinClassFieldV1_DETAILED,
    | "id"
    | "twinClassId"
    | "key"
    | "name"
    | "description"
    | "fieldTyperFeaturerId"
    | "twinSorterFeaturerId"
    | "viewPermissionId"
    | "editPermissionId"
    | "required"
    | "system"
    | "externalId"
    | "dependent"
    | "hasDependentFields"
    | "projectionField"
    | "hasProjectedFields"
  >,
  ColumnDef<TwinClassFieldV1_DETAILED>
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
        <div className="inline-flex max-w-48">
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
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
  },

  fieldTyperFeaturerId: {
    accessorKey: "fieldTyperFeaturerId",
    header: "Field typer",
    cell: ({ row: { original } }) =>
      original.fieldTyperFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.fieldTyperFeaturer}
            params={original.fieldTyperParams}
            withTooltip
          />
        </div>
      ),
  },

  twinSorterFeaturerId: {
    accessorKey: "twinSorterFeaturerId",
    header: "Twin sorter",
    cell: ({ row: { original } }) =>
      original.twinSorterFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.twinSorterFeaturer}
            params={original.twinSorterParams}
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
        <div className="column-flex max-w-48 space-y-2">
          <PermissionResourceLink data={original.viewPermission} withTooltip />
        </div>
      ),
  },

  editPermissionId: {
    accessorKey: "editPermissionId",
    header: "Edit permission",
    cell: ({ row: { original } }) =>
      original.editPermission && (
        <div className="column-flex max-w-48 space-y-2">
          <PermissionResourceLink data={original.editPermission} withTooltip />
        </div>
      ),
  },

  required: {
    accessorKey: "required",
    header: "Required",
    cell: (data) => data.getValue() && <Check />,
  },

  system: {
    accessorKey: "system",
    header: "System",
    cell: (data) => data.getValue() && <Check />,
  },

  externalId: {
    accessorKey: "externalId",
    header: "External id",
  },

  dependent: {
    accessorKey: "dependent",
    header: "Dependent",
    cell: (data) => data.getValue() && <Check />,
  },

  hasDependentFields: {
    accessorKey: "hasDependentFields",
    header: "Has dependent fields",
    cell: (data) => data.getValue() && <Check />,
  },

  projectionField: {
    accessorKey: "projectionField",
    header: "Projected",
    cell: (data) => data.getValue() && <Check />,
  },

  hasProjectedFields: {
    accessorKey: "hasProjectedFields",
    header: "Has projected fields",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function TwinClassFieldsTable({
  twinClassId,
}: {
  twinClassId?: string;
}) {
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const api = useContext(PrivateApiContext);
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFieldFilters({
    enabledFilters: isTruthy(twinClassId)
      ? [
          "idList",
          "keyLikeList",
          "nameI18nLikeList",
          "descriptionI18nLikeList",
          "fieldTyperIdList",
          "twinSorterIdList",
          "viewPermissionIdList",
          "editPermissionIdList",
          "required",
          "system",
          "dependentField",
          "hasDependentFields",
          "projectionField",
          "hasProjectionFields",
        ]
      : undefined,
  });
  const { searchByFilters } = useTwinClassFieldSearch();

  async function fetchFields(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinClassFieldV1_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      const response = await searchByFilters({
        pagination,
        filters: {
          ..._filters,
          twinClassIdMap: twinClassId
            ? reduceToObject({ list: toArray(twinClassId), defaultValue: true })
            : _filters.twinClassIdMap,
        },
      });

      return {
        data: response.data ?? [],
        pagination: response.pagination ?? {},
      };
    } catch {
      toast.error("Failed to fetch fields");
      return { data: [], pagination: {} };
    }
  }

  const form = useForm<TwinClassFieldFormValues>({
    resolver: zodResolver(TWIN_CLASS_FIELD_SCHEMA),
    defaultValues: {
      twinClassId: twinClassId || "",
      key: "",
      name: "",
      description: "",
      required: false,
      fieldTyperParams: {},
      viewPermissionId: "",
      editPermissionId: "",
    },
  });

  const handleOnCreateSubmit = async (formValues: TwinClassFieldFormValues) => {
    const body: TwinClassFieldCreateRq = {
      key: formValues.key,
      required: formValues.required,
      nameI18n: {
        translationInCurrentLocale: formValues.name,
      },
      descriptionI18n: {
        translationInCurrentLocale: formValues.description,
      },
      fieldTyperFeaturerId: formValues.fieldTyperFeaturerId,
      fieldTyperParams: formValues.fieldTyperParams,
      viewPermissionId: formValues.viewPermissionId,
      editPermissionId: formValues.editPermissionId,
    };

    const { error } = await api.twinClassField.create({
      id: twinClassId || formValues.twinClassId!,
      body,
    });
    if (error) {
      throw error;
    }
    toast.success("Class field created successfully!");
  };

  return (
    <CrudDataTable
      title="Fields"
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.twinClassId,
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.fieldTyperFeaturerId,
        colDefs.twinSorterFeaturerId,
        colDefs.viewPermissionId,
        colDefs.editPermissionId,
        colDefs.required,
        colDefs.system,
        colDefs.externalId,
        colDefs.dependent,
        colDefs.hasDependentFields,
        colDefs.projectionField,
        colDefs.hasProjectedFields,
      ]}
      getRowId={(row) => row.id}
      fetcher={fetchFields}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/fields/${row.id}`)
      }
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
        colDefs.twinSorterFeaturerId,
        colDefs.viewPermissionId,
        colDefs.editPermissionId,
        colDefs.required,
        colDefs.system,
        colDefs.externalId,
        colDefs.dependent,
        colDefs.hasDependentFields,
        colDefs.projectionField,
        colDefs.hasProjectedFields,
      ]}
      dialogForm={form}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <TwinClassFieldFormFields control={form.control} />
      )}
    />
  );
}
