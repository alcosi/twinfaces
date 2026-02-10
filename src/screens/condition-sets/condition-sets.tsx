"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import {
  CONDITION_SET_SCHEMA,
  ConditionSetFieldValues,
  FactoryConditionSetCreateRq,
  FactoryConditionSet_DETAILED,
  useFactoryConditionSetFilters,
  useFactoryConditionSetSearch,
} from "@/entities/factory-condition-set";
import { FactoryResourceLink } from "@/features/factory/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PrivateApiContext } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

import { ConditionSetFields } from "./form-fields";

const colDefs: Record<
  | "id"
  | "twinFactoryId"
  | "name"
  | "description"
  | "inFactoryPipelineUsagesCount"
  | "inFactoryPipelineStepUsagesCount"
  | "inFactoryMultiplierFilterUsagesCount"
  | "inFactoryBranchUsagesCount"
  | "inFactoryEraserUsagesCount"
  | "createdByUserId"
  | "createdAt",
  ColumnDef<FactoryConditionSet_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => {
      const value = data.getValue<string | undefined>();
      return value ? <GuidWithCopy value={value} /> : null;
    },
  },
  twinFactoryId: {
    id: "factoryId",
    accessorKey: "factoryId",
    header: "Factory",
    cell: ({ row: { original } }) =>
      original.factory && (
        <div className="inline-flex max-w-48">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },
  name: {
    id: "name",
    accessorKey: "name",
    header: "Name",
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
  inFactoryPipelineUsagesCount: {
    id: "inFactoryPipelineUsagesCount",
    accessorKey: "inFactoryPipelineUsagesCount",
    header: "In pipelines usages count",
  },
  inFactoryPipelineStepUsagesCount: {
    id: "inFactoryPipelineStepUsagesCount",
    accessorKey: "inFactoryPipelineStepUsagesCount",
    header: "In steps usages count",
  },
  inFactoryMultiplierFilterUsagesCount: {
    id: "inFactoryMultiplierFilterUsagesCount",
    accessorKey: "inFactoryMultiplierFilterUsagesCount",
    header: "In multiplier filters usages count",
  },
  inFactoryBranchUsagesCount: {
    id: "inFactoryBranchUsagesCount",
    accessorKey: "inFactoryBranchUsagesCount",
    header: "In branches usages count",
  },
  inFactoryEraserUsagesCount: {
    id: "inFactoryEraserUsagesCount",
    accessorKey: "inFactoryEraserUsagesCount",
    header: "In erasers usages count",
  },
  createdByUserId: {
    id: "createdByUserId",
    accessorKey: "createdByUserId",
    header: "Created by",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },
  createdAt: {
    id: "createdBy",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
};

export function ConditionSetsScreen() {
  const router = useRouter();
  const api = useContext(PrivateApiContext);
  const { searchFactoryConditionSet } = useFactoryConditionSetSearch();
  const { buildFilterFields, mapFiltersToPayload } =
    useFactoryConditionSetFilters();

  async function fetchFactoryConditionSet(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return searchFactoryConditionSet({ pagination, filters: _filters });
    } catch (error) {
      toast.error(
        "An error occured while fetching factory condition sets: " + error
      );
      throw new Error(
        "An error occured while fetching factory condition sets: " + error
      );
    }
  }

  const conditionSetForm = useForm<ConditionSetFieldValues>({
    resolver: zodResolver(CONDITION_SET_SCHEMA),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof CONDITION_SET_SCHEMA>
  ) => {
    const requestBody: FactoryConditionSetCreateRq = {
      conditionSets: [
        {
          name: formValues.name,
          twinFactoryId: formValues.twinFactoryId,
          description: formValues.description,
        },
      ],
    };

    const { error } = await api.factoryConditionSet.create({
      body: requestBody,
    });

    if (error) {
      throw error;
    }
    toast.success("Condition set created successfully!");
  };

  return (
    <CrudDataTable
      title="Condition sets"
      columns={[
        colDefs.id,
        colDefs.twinFactoryId,
        colDefs.name,
        colDefs.description,
        colDefs.inFactoryPipelineUsagesCount,
        colDefs.inFactoryPipelineStepUsagesCount,
        colDefs.inFactoryMultiplierFilterUsagesCount,
        colDefs.inFactoryBranchUsagesCount,
        colDefs.inFactoryEraserUsagesCount,
        colDefs.createdByUserId,
        colDefs.createdAt,
      ]}
      fetcher={fetchFactoryConditionSet}
      getRowId={(row) => row.id || ""}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/condition-sets/${row.id}`)
      }
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.twinFactoryId,
        colDefs.name,
        colDefs.description,
        colDefs.inFactoryPipelineUsagesCount,
        colDefs.inFactoryPipelineStepUsagesCount,
        colDefs.inFactoryMultiplierFilterUsagesCount,
        colDefs.inFactoryBranchUsagesCount,
        colDefs.inFactoryEraserUsagesCount,
        colDefs.createdByUserId,
        colDefs.createdAt,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      dialogForm={conditionSetForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <ConditionSetFields control={conditionSetForm.control} />
      )}
    />
  );
}
