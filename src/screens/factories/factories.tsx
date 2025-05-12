"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useEffect } from "react";
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
import { useBreadcrumbs } from "@/features/breadcrumb";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

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
  const { searchFactories } = useFactorySearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryFilters();
  const { setBreadcrumbs } = useBreadcrumbs();
  const { createFactory } = useCreateFactory();

  useEffect(() => {
    setBreadcrumbs([
      { label: "Factories", href: `/${PlatformArea.core}/factories` },
    ]);
  }, []);

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
    <CrudDataTable
      columns={Object.values(colDefs) as ColumnDef<Factory>[]}
      fetcher={fetchFactories}
      getRowId={(row) => row.id!}
      pageSizes={[10, 20, 50]}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.key,
        colDefs.name,
        colDefs.description,
        colDefs.createdByUser,
        colDefs.factoryUsagesCount,
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
  );
}
