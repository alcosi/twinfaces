"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { toast } from "sonner";

import { Rule_DETAILED, useRuleSearch } from "@/entities/twin-class";
import { PagedResponse } from "@/shared/api";
import { GuidWithCopy } from "@/shared/ui";

import { CrudDataTable, FiltersState } from "../../crud-data-table";

const colDefs: Record<
  "id" | "overwrittenValue" | "overwrittenRequired" | "rulePriority",
  ColumnDef<Rule_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },
  overwrittenValue: {
    id: "overwrittenValue",
    accessorKey: "overwrittenValue",
    header: "Overwritten value",
  },
  overwrittenRequired: {
    id: "overwrittenRequired",
    accessorKey: "overwrittenRequired",
    header: "Overwritten required",
    cell: (data) => data.getValue() && <Check />,
  },
  rulePriority: {
    id: "rulePriority",
    accessorKey: "rulePriority",
    header: "Priority",
  },
};

export function RulesTable() {
  const { searchRule } = useRuleSearch();

  async function fetchRules(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<Rule_DETAILED>> {
    try {
      return await searchRule({
        pagination,
        filters: {},
      });
    } catch (error) {
      toast.error("An error occured while fetching rules:" + error);
      throw new Error("An error occured while fetching rules:" + error);
    }
  }

  return (
    <CrudDataTable
      title="Rules"
      columns={[
        colDefs.id,
        colDefs.overwrittenValue,
        colDefs.overwrittenRequired,
        colDefs.rulePriority,
      ]}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.overwrittenValue,
        colDefs.overwrittenRequired,
        colDefs.rulePriority,
      ]}
      fetcher={fetchRules}
      getRowId={(row) => row.id!}
    />
  );
}
