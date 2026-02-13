"use client";

import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

import { Recipient_DETAILED, useRecipientSearch } from "@/entities/recipient";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import { formatIntlDate } from "@/shared/libs";
import { GuidWithCopy } from "@/shared/ui";
import { CrudDataTable, FiltersState } from "@/widgets/crud-data-table";

const colDefs: Record<
  "id" | "name" | "description" | "createdByUser" | "createdAt",
  ColumnDef<Recipient_DETAILED>
> = {
  id: {
    id: "id",
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
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
  createdByUser: {
    id: "createdByUser",
    accessorKey: "createdByUser",
    header: "Author",
    cell: ({ row: { original } }) =>
      original.createdByUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.createdByUser} withTooltip />
        </div>
      ),
  },
  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt &&
      formatIntlDate(original.createdAt, "datetime-local"),
  },
};

export function RecipientsScreen() {
  const { searchRecipient } = useRecipientSearch();

  async function fetchRecipient(
    pagination: PaginationState,
    filters?: FiltersState
  ): Promise<PagedResponse<Recipient_DETAILED>> {
    try {
      return await searchRecipient({
        pagination,
        filters: {},
      });
    } catch (error) {
      toast.error("An error occured while fetching recipients: " + error);
      throw new Error("An error occured while fetching recipients: " + error);
    }
  }

  return (
    <CrudDataTable
      title="Recipients"
      columns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.createdByUser,
        colDefs.createdAt,
      ]}
      fetcher={fetchRecipient}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.name,
        colDefs.description,
        colDefs.createdByUser,
        colDefs.createdAt,
      ]}
      getRowId={(row) => row.id!}
    />
  );
}
