import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";

import {
  Attachment_DETAILED,
  useAttachmentFilters,
  useAttachmentSearchV1,
} from "@/entities/attachment";
import { CommentResourceLink } from "@/entities/comment";
import { PermissionResourceLink } from "@/entities/permission";
import { TwinResourceLink } from "@/entities/twin";
import { TwinClassFieldResourceLink } from "@/entities/twin-class-field";
import { TwinFlowTransitionResourceLink } from "@/entities/twin-flow-transition";
import { UserResourceLink } from "@/entities/user";
import { PagedResponse } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
import {
  formatToTwinfaceDate,
  isFalsy,
  isTruthy,
  toArray,
  toArrayOfString,
} from "@/shared/libs";
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
    | "storageLink"
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
        <div className="max-w-48 inline-flex">
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

  storageLink: {
    id: "storageLink",
    accessorKey: "storageLink",
    header: "Link",
    cell: (data) => (
      <div onClick={(e) => e.stopPropagation()}>
        <a
          href={data.getValue<string>()}
          className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
        >
          <GuidWithCopy value={data.getValue<string>()} />
        </a>
      </div>
    ),
  },

  title: {
    id: "title",
    accessorKey: "title",
    header: "Title",
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
        <div className="max-w-48 inline-flex">
          <TwinClassFieldResourceLink
            data={original.twinClassField}
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
        <div className="max-w-48 inline-flex">
          <TwinFlowTransitionResourceLink
            data={original.twinflowTransition}
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
        <div className="max-w-48 inline-flex">
          <CommentResourceLink data={original.comment} withTooltip />
        </div>
      ),
  },

  viewPermissionId: {
    id: "viewPermissionId",
    accessorKey: "viewPermissionId",
    header: "View Permission",
    cell: ({ row: { original } }) =>
      original.viewPermission && (
        <div className="max-w-48 column-flex space-y-2">
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
        <div className="max-w-48 inline-flex">
          <UserResourceLink data={original.authorUser} withTooltip />
        </div>
      ),
  },

  createdAt: {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row: { original } }) =>
      original.createdAt && formatToTwinfaceDate(original.createdAt),
  },
};

export function TwinAttachmentsTable({ twinId }: { twinId?: string }) {
  const tableRef = useRef<DataTableHandle>(null);
  const router = useRouter();
  const { buildFilterFields, mapFiltersToPayload } = useAttachmentFilters({
    enabledFilters: isTruthy(twinId)
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
          "createdAt",
        ]
      : undefined,
  });
  const { searchAttachment } = useAttachmentSearchV1();

  async function fetchAttachments(
    pagination: PaginationState,
    filters: FiltersState
  ): Promise<PagedResponse<Attachment_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      const response = await searchAttachment({
        pagination,
        filters: {
          ..._filters,
          twinIdList: twinId
            ? toArrayOfString(toArray(twinId), "id")
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
      title="Attachments"
      ref={tableRef}
      columns={[
        colDefs.id,
        ...(isFalsy(twinId) ? [colDefs.twinId] : []),
        colDefs.externalId,
        colDefs.storageLink,
        colDefs.title,
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
      onRowClick={(row) =>
        router.push(
          `/${PlatformArea.core}/twins/${row.twinId}/attachment/${row.id}`
        )
      }
      filters={{
        filtersInfo: buildFilterFields(),
      }}
      defaultVisibleColumns={[
        colDefs.id,
        ...(isFalsy(twinId) ? [colDefs.twinId] : []),
        colDefs.externalId,
        colDefs.storageLink,
        colDefs.title,
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
