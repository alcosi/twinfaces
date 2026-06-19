import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check, EllipsisVertical, FolderUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  FACTORY_TRIGGER_SCHEMA,
  FactoryTrigger_DETAILED,
  useFactoryTriggerCreate,
  useFactoryTriggerFilters,
  useFactoryTriggerSearch,
} from "@/entities/factory-trigger";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FactoryResourceLink } from "@/features/factory/ui";
import { TwinClassResourceLink } from "@/features/twin-class/ui";
import { TwinTriggerResourceLink } from "@/features/twin-trigger/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { isTruthy, toArray, toArrayOfString } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GuidWithCopy,
} from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import {
  FactoryTriggerExportSqlDialog,
  FactoryTriggerExportSqlDialogRef,
} from "./factory-trigger-export-sql-dialog";
import { TriggersFormFields } from "./form-fields";

type TriggersFormValues = z.infer<typeof FACTORY_TRIGGER_SCHEMA>;

const colDefs: Record<
  | "id"
  | "factory"
  | "inputTwinClass"
  | "factoryConditionSet"
  | "twinFactoryConditionInvert"
  | "active"
  | "description"
  | "twinTrigger"
  | "async",
  ColumnDef<FactoryTrigger_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  factory: {
    id: "factory",
    accessorKey: "factory",
    header: "Twin factory",
    cell: ({ row: { original } }) =>
      original.factory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },
  inputTwinClass: {
    id: "inputTwinClass",
    accessorKey: "inputTwinClass",
    header: "Input twin class",
    cell: ({ row: { original } }) =>
      original.inputTwinClass && (
        <div className="inline-flex max-w-48">
          <TwinClassResourceLink
            data={original.inputTwinClass as TwinClass_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Twin factory condition set",
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <div className="inline-flex max-w-48">
          <FactoryConditionSetResourceLink
            data={original.factoryConditionSet}
            withTooltip
          />
        </div>
      ),
  },
  twinFactoryConditionInvert: {
    id: "twinFactoryConditionInvert",
    accessorKey: "twinFactoryConditionInvert",
    header: "Twin factory condition invert",
    cell: (data) => data.getValue() && <Check />,
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
  },
  twinTrigger: {
    id: "twinTrigger",
    accessorKey: "twinTrigger",
    header: "Twin trigger",
    cell: ({ row: { original } }) =>
      original.twinTrigger && (
        <div className="inline-flex max-w-48">
          <TwinTriggerResourceLink data={original.twinTrigger} withTooltip />
        </div>
      ),
  },
  async: {
    id: "async",
    accessorKey: "async",
    header: "Async",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function FactoryTriggersTable({
  twinTriggerId,
}: {
  twinTriggerId?: string;
}) {
  const router = useRouter();
  const { searchFactoryTrigger } = useFactoryTriggerSearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryTriggerFilters({
    enabledFilters: isTruthy(twinTriggerId)
      ? [
          "idList",
          "twinFactoryIdList",
          "inputTwinClassIdList",
          "idList",
          "active",
          "async",
        ]
      : undefined,
  });
  const { createFactoryTrigger } = useFactoryTriggerCreate();
  const exportSqlDialogRef = useRef<FactoryTriggerExportSqlDialogRef>(null);

  const actionsCol: ColumnDef<FactoryTrigger_DETAILED> = {
    id: "actions",
    header: "Actions",
    cell: ({ row: { original } }) => (
      <div
        className="flex justify-end"
        onClick={(event) => event.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="iconS6"
              onClick={(event) => event.stopPropagation()}
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                exportSqlDialogRef.current?.open(
                  original as FactoryTrigger_DETAILED
                );
              }}
              className="cursor-pointer"
            >
              <FolderUp className="mr-2 h-4 w-4" />
              Export sql
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  };

  async function fetchFactoryTriggers(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<FactoryTrigger_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);
    try {
      return await searchFactoryTrigger({
        pagination,
        filters: {
          ..._filters,
          twinTriggerIdList: twinTriggerId
            ? toArrayOfString(toArray(twinTriggerId), "id")
            : _filters.twinTriggerIdList,
        },
      });
    } catch (error) {
      toast.error("An error occured while fetching factory triggers:" + error);
      throw new Error(
        "An error occured while fetching factory triggers: " + error
      );
    }
  }

  const triggersForm = useForm<TriggersFormValues>({
    resolver: zodResolver(FACTORY_TRIGGER_SCHEMA),
    defaultValues: {
      twinTriggerId: twinTriggerId || "",
      twinFactoryConditionInvert: false,
      active: false,
      async: false,
    },
  });

  const handleOnCreateSubmit = async (formValues: TriggersFormValues) => {
    console.log("🚀 ~ handleOnCreateSubmit ~ formValues:", formValues);
    try {
      await createFactoryTrigger({
        body: {
          twinFactoryTriggers: [
            {
              twinFactoryId: formValues.twinFactoryId,
              inputTwinClassId: formValues.inputTwinClassId,
              twinFactoryConditionSetId: formValues.twinFactoryConditionSetId,
              twinFactoryConditionInvert: formValues.twinFactoryConditionInvert,
              active: formValues.active,
              description: formValues.description,
              twinTriggerId: formValues.twinTriggerId,
              async: formValues.async,
            },
          ],
        },
      });

      toast.success("Factory trigger created successfully");
    } catch {
      toast.error("Failed to create factory trigger");
    }
  };

  return (
    <>
      <CrudDataTable
        permissionSegment="factory-triggers"
        title="Factory triggers"
        columns={[
          colDefs.id,
          colDefs.factory,
          colDefs.inputTwinClass,
          colDefs.factoryConditionSet,
          colDefs.twinFactoryConditionInvert,
          colDefs.active,
          colDefs.description,
          ...(twinTriggerId ? [] : [colDefs.twinTrigger]),
          colDefs.async,
          actionsCol,
        ]}
        fetcher={fetchFactoryTriggers}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.factory,
          colDefs.inputTwinClass,
          colDefs.factoryConditionSet,
          colDefs.twinFactoryConditionInvert,
          colDefs.active,
          colDefs.description,
          ...(twinTriggerId ? [] : [colDefs.twinTrigger]),
          colDefs.async,
          actionsCol,
        ]}
        filters={{ filtersInfo: buildFilterFields() }}
        getRowId={(row) => row.id!}
        onRowClick={(row) =>
          router.push(`/${PlatformArea.core}/factory-triggers/${row.id}`)
        }
        dialogForm={triggersForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <TriggersFormFields control={triggersForm.control} />
        )}
      />

      <FactoryTriggerExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
