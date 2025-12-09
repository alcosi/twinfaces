"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  FactoryCondition_DETAILED,
  useFactoryConditionFilters,
  useFactoryConditionSearch,
} from "@/entities/factory-condition";
import { FactoryConditionSet_DETAILED } from "@/entities/factory-condition-set";
import { Featurer_DETAILED } from "@/entities/featurer";
import { FactoryConditionSetResourceLink } from "@/features/factory-condition-set/ui";
import { FeaturerResourceLink } from "@/features/featurer/ui";
import { PlatformArea } from "@/shared/config";
import { isFalsy, isTruthy, toArray, toArrayOfString } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    FactoryCondition_DETAILED,
    | "id"
    | "factoryConditionSet"
    | "conditionerFeaturer"
    | "description"
    | "active"
    | "invert"
  >,
  ColumnDef<FactoryCondition_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  factoryConditionSet: {
    id: "factoryConditionSet",
    accessorKey: "factoryConditionSet",
    header: "Condition Set",
    cell: ({ row: { original } }) =>
      original.factoryConditionSet && (
        <div className="inline-flex max-w-48">
          <FactoryConditionSetResourceLink
            data={original.factoryConditionSet as FactoryConditionSet_DETAILED}
            withTooltip
          />
        </div>
      ),
  },
  conditionerFeaturer: {
    id: "conditionerFeaturer",
    accessorKey: "conditionerFeaturer",
    header: "Conditioner Featurer",
    cell: ({ row: { original } }) =>
      original.conditionerFeaturer && (
        <div className="inline-flex max-w-48">
          <FeaturerResourceLink
            data={original.conditionerFeaturer as Featurer_DETAILED}
            withTooltip
          />
        </div>
      ),
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
  active: {
    id: "active",
    accessorKey: "active",
    header: "Active",
    cell: (data) => data.getValue() && <Check />,
  },
  invert: {
    id: "invert",
    accessorKey: "invert",
    header: "Invert",
    cell: (data) => data.getValue() && <Check />,
  },
};

export function FactoryConditionsTable({
  factoryConditionSetId,
  title,
}: {
  factoryConditionSetId?: string;
  title?: string;
}) {
  const router = useRouter();
  const { searchFactoryCondition } = useFactoryConditionSearch();
  const { buildFilterFields, mapFiltersToPayload } = useFactoryConditionFilters(
    {
      enabledFilters: isTruthy(factoryConditionSetId)
        ? [
            "idList",
            "conditionerFeaturerIdList",
            "descriptionLikeList",
            "active",
            "invert",
          ]
        : undefined,
    }
  );

  async function fetchFactoryConditions(
    pagination: PaginationState,
    filters: FiltersState
  ) {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchFactoryCondition({
        pagination,
        filters: {
          ..._filters,
          factoryConditionSetIdList: factoryConditionSetId
            ? toArrayOfString(toArray(factoryConditionSetId), "id")
            : _filters.factoryConditionSetIdList,
        },
      });
    } catch (error) {
      toast.error(
        "An error occured while fetching factory conditions: " + error
      );
      throw new Error("An error occured while factory conditions: " + error);
    }
  }

  return (
    <CrudDataTable
      columns={[
        colDefs.id,
        ...(isFalsy(factoryConditionSetId)
          ? [colDefs.factoryConditionSet]
          : []),
        colDefs.conditionerFeaturer,
        colDefs.description,
        colDefs.active,
        colDefs.invert,
      ]}
      fetcher={fetchFactoryConditions}
      getRowId={(row) => row.id}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/conditions/${row.id}`)
      }
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(factoryConditionSetId)
          ? [colDefs.factoryConditionSet]
          : []),
        colDefs.conditionerFeaturer,
        colDefs.description,
        colDefs.active,
        colDefs.invert,
      ]}
      filters={{ filtersInfo: buildFilterFields() }}
      title={title || "Factory Conditions"}
    />
  );
}
