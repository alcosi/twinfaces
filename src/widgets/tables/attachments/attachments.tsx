"use client";

import { ColumnDef, PaginationState } from "@tanstack/table-core";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { toast } from "sonner";

import {
  AttachmentFilterKeys,
  Attachment_DETAILED,
  useAttachmentCount,
  useAttachmentFilters,
  useAttachmentSearchV2,
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
import { PagedResponse, SortV1 } from "@/shared/api";
import { PlatformArea } from "@/shared/config";
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
  ChartDataContext,
  ChartGrouping,
  CrudDataTable,
  DataTableHandle,
  FiltersState,
  SortableHeader,
  buildCountGroupingLoad,
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
    header: () => <SortableHeader title="Twin" sortField="twinName" />,
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
    header: () => <SortableHeader title="External Id" sortField="externalId" />,
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
    cell: ({ row: { original } }) =>
      original.description && (
        <div className="text-muted-foreground line-clamp-2 max-w-64">
          {original.description}
        </div>
      ),
  },

  twinClassFieldId: {
    id: "twinClassFieldId",
    accessorKey: "twinClassFieldId",
    header: () => (
      <SortableHeader title="Field" sortField="twinClassFieldName" />
    ),
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
    header: () => (
      <SortableHeader title="Transition" sortField="twinflowTransitionName" />
    ),
    cell: ({ row: { original } }) =>
      original.twinflowTransition && (
        <div className="inline-flex max-w-48">
          <TwinFlowTransitionResourceLink
            data={original.twinflowTransition as TwinFlowTransition_DETAILED}
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
    header: () => (
      <SortableHeader title="View Permission" sortField="viewPermissionName" />
    ),
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
    header: () => <SortableHeader title="Author" sortField="authorUserName" />,
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
    header: () => <SortableHeader title="Created at" sortField="createdAt" />,
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
  const router = useRouter();
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
          "createdAt",
        ]
      : undefined,
  });
  const { searchAttachments } = useAttachmentSearchV2();
  const { countAttachment } = useAttachmentCount();

  async function fetchAttachments(
    pagination: PaginationState,
    filters: FiltersState,
    sort?: SortV1
  ): Promise<PagedResponse<Attachment_DETAILED>> {
    const _filters = mapFiltersToPayload(filters.filters);

    try {
      return await searchAttachments({
        pagination,
        filters: {
          ..._filters,
          twinIdList: baseTwinId
            ? toArrayOfString(toArray(baseTwinId), "id")
            : _filters.twinIdList,
        },
        sort,
      });
    } catch {
      toast.error("Failed to fetch attachments");
      return { data: [], pagination: {} };
    }
  }

  // Builds the pie-chart groupings backed by the server-side count endpoint
  // (/private/attachment/count/v1), bound to the active filters. When the table
  // is scoped to a single twin (embedded in a twin page) the twin itself is
  // excluded — grouping by a constant value carries no information.
  const buildChartGroupings = useCallback(
    ({ filters }: ChartDataContext): ChartGrouping[] => {
      const resolved = mapFiltersToPayload(
        filters as Record<AttachmentFilterKeys, unknown>
      );
      const scopedFilters = {
        ...resolved,
        twinIdList: baseTwinId
          ? toArrayOfString(toArray(baseTwinId), "id")
          : resolved.twinIdList,
      };

      return [
        ...(isFalsy(baseTwinId)
          ? [
              {
                key: "twin",
                label: "Twin",
                load: buildCountGroupingLoad(
                  ({ offset, limit }) =>
                    countAttachment({
                      filters: scopedFilters,
                      groupField: "twinId",
                      offset,
                      limit,
                    }),
                  (g) => g.twinId,
                  (g) => g.twin?.name,
                  (g) =>
                    g.twin && <TwinResourceLink data={g.twin} withTooltip />
                ),
              },
            ]
          : []),
        {
          key: "transition",
          label: "Transition",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countAttachment({
                filters: scopedFilters,
                groupField: "twinflowTransitionId",
                offset,
                limit,
              }),
            (g) => g.twinflowTransitionId,
            (g) => g.twinflowTransition?.name,
            (g) =>
              g.twinflowTransition && (
                <TwinFlowTransitionResourceLink
                  data={g.twinflowTransition as TwinFlowTransition_DETAILED}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "viewPermission",
          label: "View permission",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countAttachment({
                filters: scopedFilters,
                groupField: "viewPermissionId",
                offset,
                limit,
              }),
            (g) => g.viewPermissionId,
            (g) => g.viewPermission?.name,
            (g) =>
              g.viewPermission && (
                <PermissionResourceLink data={g.viewPermission} withTooltip />
              )
          ),
        },
        {
          key: "author",
          label: "Author",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countAttachment({
                filters: scopedFilters,
                groupField: "createdByUserId",
                offset,
                limit,
              }),
            (g) => g.createdByUserId,
            (g) => g.author?.fullName,
            (g) => g.author && <UserResourceLink data={g.author} withTooltip />
          ),
        },
        {
          key: "field",
          label: "Field",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countAttachment({
                filters: scopedFilters,
                groupField: "twinClassFieldId",
                offset,
                limit,
              }),
            (g) => g.twinClassFieldId,
            (g) => g.twinClassField?.name,
            (g) =>
              g.twinClassField && (
                <TwinClassFieldResourceLink
                  data={g.twinClassField as TwinClassField_DETAILED}
                  withTooltip
                />
              )
          ),
        },
        {
          key: "comment",
          label: "Comment",
          load: buildCountGroupingLoad(
            ({ offset, limit }) =>
              countAttachment({
                filters: scopedFilters,
                groupField: "twinCommentId",
                offset,
                limit,
              }),
            (g) => g.twinCommentId,
            (g) => g.comment?.text,
            (g) =>
              g.comment && (
                <CommentResourceLink
                  data={g.comment as Comment_DETAILED}
                  withTooltip
                />
              )
          ),
        },
      ];
    },
    [countAttachment, mapFiltersToPayload, baseTwinId]
  );

  return (
    <CrudDataTable
      permissionSegment="attachments"
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
      chartGroupings={buildChartGroupings}
      onRowClick={(row) =>
        router.push(`/${PlatformArea.core}/attachments/${row.id}`)
      }
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
