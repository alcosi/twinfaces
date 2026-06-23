"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { Copy, EllipsisVertical, FolderUp } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  FACTORY_SCHEMA,
  Factory,
  FactoryCreateRq,
  useCreateFactory,
  useFactoryFilters,
  useFactorySearch,
} from "@/entities/factory";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  GuidWithCopy,
} from "@/shared/ui";
import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "@/widgets/crud-data-table";

import {
  FactoryDuplicateDialog,
  FactoryDuplicateDialogRef,
} from "./factory-duplicate-dialog";
import {
  FactoryExportSqlDialog,
  FactoryExportSqlDialogRef,
} from "./factory-export-sql-dialog";
import { FactoryFormFields } from "./form-fields";

const colDefs: Record<
  keyof Omit<Factory, "createdByUserId">,
  ColumnDef<Factory>
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
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
  createdByUser: {
    id: "createdByUser",
    accessorKey: "createdByUser",
    header: "Created By",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <UserResourceLink data={original.createdByUser} />
      ),
  },
  factoryBranchesCount: {
    id: "factoryBranchesCount",
    accessorKey: "factoryBranchesCount",
    header: "Branches",
  },
  factoryUsagesCount: {
    id: "factoryUsagesCount",
    accessorKey: "factoryUsagesCount",
    header: "Usages",
  },
  factoryErasersCount: {
    id: "factoryErasersCount",
    accessorKey: "factoryErasersCount",
    header: "Erasers",
  },
  factoryMultipliersCount: {
    id: "factoryMultipliersCount",
    accessorKey: "factoryMultipliersCount",
    header: "Multipliers",
  },
  factoryPipelinesCount: {
    id: "factoryPipelinesCount",
    accessorKey: "factoryPipelinesCount",
    header: "Pipelines",
  },
};

export function Factories() {
  const tableRef = useRef<DataTableHandle>(null);
  const duplicateDialogRef = useRef<FactoryDuplicateDialogRef>(null);
  const exportSqlDialogRef = useRef<FactoryExportSqlDialogRef>(null);
  const { searchFactories } = useFactorySearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryFilters();
  const { createFactory } = useCreateFactory();

  const actionsCol: ColumnDef<Factory> = {
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
                duplicateDialogRef.current?.open(original);
              }}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                exportSqlDialogRef.current?.open(original);
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

  const factoryForm = useForm<z.infer<typeof FACTORY_SCHEMA>>({
    resolver: zodResolver(FACTORY_SCHEMA),
    defaultValues: {
      key: "",
      name: "",
      description: "",
    },
  });

  async function fetchFactories(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<Factory>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactories({
        pagination,
        filters: _filters,
      });
    } catch (error) {
      toast.error("An error occurred while fetching factories: " + error);
      throw error;
    }
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof FACTORY_SCHEMA>
  ) => {
    const body: FactoryCreateRq = {
      nameI18n: {
        translations: {
          en: formValues.name,
        },
      },
      descriptionI18n: {
        translations: {
          en: formValues.description,
        },
      },
      key: formValues.key,
    };

    await createFactory(body);
    toast.success("Factory created successfully!");
  };

  return (
    <>
      <CrudDataTable
        ref={tableRef}
        columns={
          [...Object.values(colDefs), actionsCol] as ColumnDef<Factory>[]
        }
        fetcher={fetchFactories}
        getRowId={(row) => row.id!}
        defaultVisibleColumns={[
          colDefs.id,
          colDefs.key,
          colDefs.name,
          colDefs.description,
          colDefs.createdByUser,
          colDefs.factoryUsagesCount,
          actionsCol,
        ]}
        filters={{
          filtersInfo: buildFilterFields(),
        }}
        dialogForm={factoryForm}
        onCreateSubmit={handleOnCreateSubmit}
        renderFormFields={() => (
          <FactoryFormFields control={factoryForm.control} />
        )}
      />

      <FactoryDuplicateDialog ref={duplicateDialogRef} />
      <FactoryExportSqlDialog ref={exportSqlDialogRef} />
    </>
  );
}
