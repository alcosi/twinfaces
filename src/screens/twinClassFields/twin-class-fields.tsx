import { TwinClassResourceLink } from "@/entities/twinClass";
import { ApiContext, PagedResponse } from "@/shared/api";
import { FiltersState } from "@/shared/ui/data-table/crud-data-table";
import { DataTableHandle } from "@/shared/ui/data-table/data-table";
import { GuidWithCopy } from "@/shared/ui/guid";
import { Experimental_CrudDataTable } from "@/widgets";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useContext, useRef } from "react";
import { toast } from "sonner";
import { FeaturerResourceLink } from "@/entities/featurer";
import { PermissionResourceLink } from "@/entities/permission";
import { REGEX_PATTERNS, toArray, toArrayOfString } from "@/shared/libs";
import {
  TwinClassFieldCreateRq,
  TwinClassFieldV2_DETAILED,
  useSearchTwinclassFields,
  useTwinClassFieldFilters,
} from "@/entities/twinClassField";
import { useRouter } from "next/navigation";
import { TwinClassFieldFormFields } from "./form-fields";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
    cell: (data) => <>{data.getValue() && <Check />}</>,
  },
};

export function TwinClassFields({ twinClassId }: { twinClassId?: string }) {
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const api = useContext(ApiContext);
  const { buildFilterFields, mapFiltersToPayload } = useTwinClassFieldFilters();
  const { searchFields } = useSearchTwinclassFields();

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
  });

  async function fetchFields(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<TwinClassFieldV2_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      const response = await searchFields({
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

  if (!twinClassId) {
    console.error("TwinClassFields: no twin class");
    return;
  }
  return (
    <Experimental_CrudDataTable
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
        router.push(`/workspace/twinclass/${twinClassId}/twinField/${row.id}`)
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
