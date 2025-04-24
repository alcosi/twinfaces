import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRef } from "react";
import { toast } from "sonner";

import {
  Attachment_DETAILED,
  useAttachmentFilters,
  useAttachmentSearchV1,
} from "@/entities/attachment";
import { Comment_DETAILED } from "@/entities/comment";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { CommentResourceLink } from "@/features/comment/ui";
import { PermissionResourceLink } from "@/features/permission/ui";
import { TwinClassFieldResourceLink } from "@/features/twin-class-field/ui";
import { TwinFlowTransitionResourceLink } from "@/features/twin-flow-transition/ui";
import { TwinResourceLink } from "@/features/twin/ui";
import { UserResourceLink } from "@/features/user/ui";
import { PagedResponse } from "@/shared/api";
import {
  formatIntlDate,
  isFalsy,
  isTruthy,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
import { AnchorWithCopy } from "@/shared/ui";
import { GuidWithCopy } from "@/shared/ui/guid";

import {
  CrudDataTable,
  DataTableHandle,
  FiltersState,
} from "../../crud-data-table";

const colDefs: Record<
  keyof Pick<
    Attachment_DETAILED,
    | "id"
    | "twinId"
    | "externalId"
    | "title"
    | "description"
    | "twinClassFieldId"
    | "twinflowTransitionId"
    | "commentId"
    | "viewPermissionId"
    | "authorUserId"
    | "createdAt"
  >,
  ColumnDef<Attachment_DETAILED>
> = {
  id: {
    accessorKey: "id",
    header: "ID",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  twinId: {
    id: "twinId",
    accessorKey: "twinId",
    header: "Twin",
    cell: ({ row: { original } }) =>
      original.twin && (
        <div className="inline-flex max-w-48">
          <TwinResourceLink data={original.twin} withTooltip />
        </div>
      ),
  },

  externalId: {
    id: "externalId",
    accessorKey: "externalId",
    header: "External Id",
    cell: (data) => <GuidWithCopy value={data.getValue<string>()} />,
  },

  title: {
    id: "title",
    accessorKey: "title",
    header: "Title",
    cell: ({ row: { original } }) => {
      return (
        <div className="max-w-48">
          <AnchorWithCopy href={original.storageLink} className="truncate">
            {original.title}
          </AnchorWithCopy>
        </div>
      );
    },
  },

  description: {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },

  twinClassFieldId: {
    id: "twinClassFieldId",
    accessorKey: "twinClassFieldId",
    header: "Field",
    cell: ({ row: { original } }) =>
      original.twinClassField && (
        <div className="inline-flex max-w-48">
          <TwinClassFieldResourceLink
            data={original.twinClassField as TwinClassField_DETAILED}
            withTooltip
          />
        </div>
      ),
  },

  twinflowTransitionId: {
    id: "twinflowTransitionId",
    accessorKey: "twinflowTransitionId",
    header: "Transition",
    cell: ({ row: { original } }) =>
      original.twinflowTransition && (
        <div className="inline-flex max-w-48">
          <TwinFlowTransitionResourceLink
            data={original.twinflowTransition as TwinFlowTransition_DETAILED}
            twinClassId={original.twin?.twinClassId!}
            twinFlowId={original.twinflowTransitionId!}
            withTooltip
          />
        </div>
      ),
  },

  commentId: {
    id: "commentId",
    accessorKey: "commentId",
    header: "Comment",
    cell: ({ row: { original } }) =>
      original.comment && (
        <div className="inline-flex max-w-48">
          <CommentResourceLink
            data={original.comment as Comment_DETAILED}
            withTooltip
          />
        </div>
      ),
  },

  viewPermissionId: {
    id: "viewPermissionId",
    accessorKey: "viewPermissionId",
    header: "View Permission",
    cell: ({ row: { original } }) =>
      original.viewPermission && (
        <div className="column-flex max-w-48 space-y-2">
          <PermissionResourceLink data={original.viewPermission} withTooltip />
        </div>
      ),
  },

  authorUserId: {
    id: "authorUserId",
    accessorKey: "authorUserId",
    header: "Author",
    cell: ({ row: { original } }) =>
      original.authorUser && (
        <div className="inline-flex max-w-48">
          <UserResourceLink data={original.authorUser} withTooltip />
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

type Props = {
  title?: string;
  baseTwinId?: string;
};

export function AttachmentsTable({ title = "Attachments", baseTwinId }: Props) {
  const tableRef = useRef<DataTableHandle>(null);
  const { buildFilterFields, mapFiltersToPayload } = useAttachmentFilters({
    enabledFilters: isTruthy(baseTwinId)
      ? [
          "idList",
          "externalIdLikeList",
          "twinflowTransitionIdList",
          "storageLinkLikeList",
          "createdByUserIdList",
          "titleLikeList",
          "descriptionLikeList",
          "viewPermissionIdList",
          "twinClassFieldIdList",
          "createdAtFrom",
          "createdAtTo",
        ]
      : undefined,
  });
  const { searchAttachments } = useAttachmentSearchV1();

  async function fetchAttachments(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<Attachment_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchAttachments({
        pagination,
        filters: {
          ..._filters,
          twinIdList: baseTwinId
            ? toArrayOfString(toArray(baseTwinId), "id")
            : _filters.twinIdList,
        },
      });

      return {
        data: response.data ?? [],
        pagination: response.pagination ?? {},
      };
    } catch (e) {
      toast.error("Failed to fetch attachments");
      return { data: [], pagination: {} };
    }
  }

  return (
    <CrudDataTable
      title={title}
      ref={tableRef}
      columns={[
        colDefs.id,
        colDefs.title,
        ...(isFalsy(baseTwinId) ? [colDefs.twinId] : []),
        colDefs.externalId,
        colDefs.description,
        colDefs.twinClassFieldId,
        colDefs.twinflowTransitionId,
        colDefs.commentId,
        colDefs.viewPermissionId,
        colDefs.authorUserId,
        colDefs.createdAt,
      ]}
      getRowId={(row) => row.id!}
      fetcher={fetchAttachments}
      pageSizes={[10, 20, 50]}
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        colDefs.title,
        ...(isFalsy(baseTwinId) ? [colDefs.twinId] : []),
        colDefs.externalId,
        colDefs.description,
        colDefs.twinClassFieldId,
        colDefs.twinflowTransitionId,
        colDefs.commentId,
        colDefs.viewPermissionId,
        colDefs.authorUserId,
        colDefs.createdAt,
      ]}
    />
  );
}
