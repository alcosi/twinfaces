import { FeaturerResourceLink } from "@/entities/featurer/components";
import { PermissionResourceLink } from "@/entities/permission";
import { TwinClassResourceLink } from "@/entities/twinClass";
import {
  TwinClassFieldCreateRq,
  TwinClassFieldV2_DETAILED,
  useTwinClassFieldFilters,
  useTwinClassFieldSearchV1,
} from "@/entities/twinClassField";
import { ApiContext, PagedResponse } from "@/shared/api";
import { REGEX_PATTERNS, toArray, toArrayOfString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui/guid";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";
import { TwinClassFieldFormFields } from "./form-fields";

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
  const api = useContext(ApiContext);
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFieldFilters();
  const { searchTwinClassFields } = useTwinClassFieldSearchV1();

  const twinClassFieldchema = z.object({
    key: z
      .string()
      .min(1)
      .max(100)
      .regex(
        REGEX_PATTERNS.ALPHANUMERIC_WITH_DASHES,
        "Key can only contain latin letters, numbers, underscores and dashes"
      ),
    name: z.string().min(0).max(100),
    description: z.string(),
    required: z.boolean(),
    fieldTyperFeaturerId: z.number(),
    fieldTyperParams: z.record(z.string()),
    viewPermissionId: z
      .string()
      .uuid()
      .optional()
      .or(z.literal("").transform(() => undefined)),
    editPermissionId: z
      .string()
      .uuid()
      .optional()
      .or(z.literal("").transform(() => undefined)),
  });

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
          twinClassIdList: toArrayOfString(toArray(twinClassId), "id"),
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

  const form = useForm<z.infer<typeof twinClassFieldchema>>({
    resolver: zodResolver(twinClassFieldchema),
    defaultValues: {
      key: "",
      name: "",
      description: "",
      required: false,
      fieldTyperFeaturerId: 0,
      viewPermissionId: "",
      editPermissionId: "",
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof twinClassFieldchema>
  ) => {
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
      id: twinClassId!,
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
        colDefs.viewPermissionId,
        colDefs.editPermissionId,
        colDefs.required,
      ]}
      getRowId={(row) => row.key!}
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
        colDefs.twinClassId,
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
