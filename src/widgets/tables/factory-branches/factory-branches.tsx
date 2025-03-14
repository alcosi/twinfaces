"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationState } from "@tanstack/react-table";
import { ColumnDef } from "@tanstack/table-core";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Factory, FactoryResourceLink } from "@/entities/factory";
import {
  FACTORY_BRANCH_SCHEMA,
  FactoryBranch,
  useFactoryBranchCreate,
  useFactoryBranchFilters,
  useFactoryBranchesSearch,
} from "@/entities/factory-branch";
import { FactoryConditionSetResourceLink } from "@/entities/factory-condition-set";
import { isFalsy, isTruthy, toArray, toArrayOfString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";
import { FactoryBranchFormFields } from "./form-fields";

const colDefs: Record<
  keyof Omit<
    FactoryBranch,
    "factoryId" | "factoryConditionSetId" | "nextFactoryId"
  >,
  ColumnDef<FactoryBranch>
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
    header: "Factory",
    cell: ({ row: { original } }) =>
      original.factory && (
        <div className="max-w-48 inline-flex">
          <FactoryResourceLink data={original.factory} withTooltip />
        </div>
      ),
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition set",
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <div className="max-w-48 inline-flex">
          <FactoryConditionSetResourceLink
            data={original.factoryConditionSet}
            withTooltip
          />
        </div>
      ),
  },
  factoryConditionSetInvert: {
    id: "factoryConditionSetInvert",
    accessorKey: "factoryConditionSetInvert",
    header: "Condition invert",
    cell: (data) => data.getValue() && <Check />,
  },
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
  nextFactory: {
    id: "nextFactory",
    accessorKey: "nextFactory",
    header: "Next Factory",
    cell: ({ row: { original } }) =>
      original.nextFactory && (
        <div className="max-w-48 inline-flex">
          <FactoryResourceLink
            data={original.nextFactory as Factory}
            withTooltip
          />
        </div>
      ),
  },
  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
};

export function FactoryBranchesTable({
  factoryId,
  title,
}: {
  factoryId?: string;
  title?: string;
}) {
  const router = useRouter();
  const { searchFactoryBranches } = useFactoryBranchesSearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryBranchFilters({
    enabledFilters: isTruthy(factoryId)
      ? [
          "idList",
          "factoryConditionSetIdList",
          "conditionInvert",
          "active",
          "nextFactoryIdList",
          "descriptionLikeList",
        ]
      : undefined,
  });
  const { createFactoryBranch } = useFactoryBranchCreate();

  const factoryBranchForm = useForm<z.infer<typeof FACTORY_BRANCH_SCHEMA>>({
    resolver: zodResolver(FACTORY_BRANCH_SCHEMA),
    defaultValues: {
      factoryId: factoryId || "",
      factoryConditionSetId: "",
      factoryConditionSetInvert: false,
      description: undefined,
      active: false,
      nextFactoryId: "",
    },
  });

  async function fetchFactoryBranches(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactoryBranches({
        pagination,
        filters: {
          ..._filters,
          factoryIdList: factoryId
            ? toArrayOfString(toArray(factoryId), "id")
            : _filters.factoryIdList,
        },
      });
    } catch (error) {
      toast.error("An error occurred while factory branches: " + error);
      throw new Error("An error occurred while factory branches: " + error);
    }
  }

  const handleOnCreateSubmit = async (
    formValues: z.infer<typeof FACTORY_BRANCH_SCHEMA>
  ) => {
    const { factoryId, ...body } = formValues;

    await createFactoryBranch({ id: factoryId, body });
    toast.success("Factory branch created successfully!");
  };

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        ...(isFalsy(factoryId) ? [colDefs.factory] : []),
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.nextFactory,
        colDefs.description,
      ]}
      fetcher={fetchFactoryBranches}
      getRowId={(row) => row.id!}
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(factoryId) ? [colDefs.factory] : []),
        colDefs.factoryConditionSet,
        colDefs.factoryConditionSetInvert,
        colDefs.active,
        colDefs.nextFactory,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      onRowClick={(row) => {
        router.push(`/workspace/branches/${row.id}`);
      }}
      dialogForm={factoryBranchForm}
      onCreateSubmit={handleOnCreateSubmit}
      renderFormFields={() => (
        <FactoryBranchFormFields control={factoryBranchForm.control} />
      )}
      title={title}
    />
  );
}
