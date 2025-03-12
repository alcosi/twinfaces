import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FeaturerResourceLink } from "@/entities/featurer/components";
import { PermissionResourceLink } from "@/entities/permission";
import { TwinClassResourceLink } from "@/entities/twin-class";
import {
  TwinClassFieldCreateRq,
  TwinClassFieldV2_DETAILED,
  useTwinClassFieldFilters,
  useTwinClassFieldSearchV1,
} from "@/entities/twin-class-field";
import { PagedResponse, PrivateApiContext } from "@/shared/api";
import { isFalsy, isTruthy, reduceToObject, toArray } from "@/shared/libs";
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
    TwinClassFieldV2_DETAILED,
    | "id"
    | "twinClassId"
    | "key"
    | "name"
    | "description"
    | "fieldTyperFeaturerId"
    | "viewPermissionId"
    | "editPermissionId"
    | "required"
  >,
  ColumnDef<TwinClassFieldV2_DETAILED>
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
        <div className="max-w-48 inline-flex">
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
  },

  fieldTyperFeaturerId: {
    accessorKey: "fieldTyperFeaturerId",
    header: "Field typer",
    cell: ({ row: { original } }) =>
      original.fieldTyperFeaturer && (
        <div className="max-w-48 inline-flex">
          <FeaturerResourceLink
            data={original.fieldTyperFeaturer}
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
        <div className="max-w-48 column-flex space-y-2">
          <PermissionResourceLink data={original.viewPermission} withTooltip />
        </div>
      ),
  },

  editPermissionId: {
    accessorKey: "editPermissionId",
    header: "Edit permission",
    cell: ({ row: { original } }) =>
      original.editPermission && (
        <div className="max-w-48 column-flex space-y-2">
          <PermissionResourceLink data={original.editPermission} withTooltip />
        </div>
      ),
  },

  required: {
    accessorKey: "required",
    header: "Required",
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
          "viewPermissionIdList",
          "editPermissionIdList",
        ]
      : undefined,
  });
  const { searchTwinClassFields } = useTwinClassFieldSearchV1();

  async function fetchFields(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinClassFieldV2_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      const response = await searchTwinClassFields({
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
    } catch (e) {
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
        ...(isFalsy(twinClassId) ? [colDefs.twinClassId] : []),
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.fieldTyperFeaturerId,
        colDefs.viewPermissionId,
        colDefs.editPermissionId,
        colDefs.required,
      ]}
      getRowId={(row) => row.id}
      fetcher={fetchFields}
      pageSizes={[10, 20, 50]}
      onRowClick={(row) =>
        router.push(
          `/workspace/twinclass/${row.twinClassId}/twinField/${row.id}`
        )
      }
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(twinClassId) ? [colDefs.twinClassId] : []),
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.fieldTyperFeaturerId,
        colDefs.viewPermissionId,
        colDefs.editPermissionId,
        colDefs.required,
      ]}
      dialogForm={form}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <TwinClassFieldFormFields control={form.control} />
      )}
    />
  );
}
