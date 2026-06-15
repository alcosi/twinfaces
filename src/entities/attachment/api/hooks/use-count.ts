import { useCallback, useContext } from "react";

import { Comment } from "@/entities/comment";
import { Permission } from "@/entities/permission";
import { TwinClassField } from "@/entities/twin-class-field";
import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { CountResult, PrivateApiContext } from "@/shared/api";

import { AttachmentCountGroupField, AttachmentFilters } from "../../libs";

/** A single server-aggregated attachment group, hydrated with its entity. */
export type AttachmentCountGroup = {
  count: number;
  twinId?: string;
  twinflowTransitionId?: string;
  viewPermissionId?: string;
  createdByUserId?: string;
  twinCommentId?: string;
  twinClassFieldId?: string;
  storageId?: string;
  twin?: Twin;
  twinflowTransition?: TwinFlowTransition;
  viewPermission?: Permission;
  author?: User;
  comment?: Comment;
  twinClassField?: TwinClassField;
};

export function useAttachmentCount() {
  const api = useContext(PrivateApiContext);

  const countAttachment = useCallback(
    async ({
      filters = {},
      groupField,
      offset,
      limit,
      sortAsc = false,
    }: {
      filters?: AttachmentFilters;
      groupField: AttachmentCountGroupField;
      offset?: number;
      limit?: number;
      sortAsc?: boolean;
    }): Promise<CountResult<AttachmentCountGroup>> => {
      try {
        const { data, error } = await api.attachment.count({
          filters,
          groupFields: [groupField],
          offset,
          limit,
          sortAsc,
        });

        if (error) {
          throw new Error("Failed to count attachments due to API error");
        }

        const related = data.relatedObjects;
        const counts = data.counts ?? [];

        const items = counts.map((group) => ({
          count: group.count ?? 0,
          twinId: group.twinId,
          twinflowTransitionId: group.twinflowTransitionId,
          viewPermissionId: group.viewPermissionId,
          createdByUserId: group.createdByUserId,
          twinCommentId: group.twinCommentId,
          twinClassFieldId: group.twinClassFieldId,
          storageId: group.storageId,
          twin:
            group.twinId && related?.twinMap
              ? (related.twinMap[group.twinId] as Twin)
              : undefined,
          twinflowTransition:
            group.twinflowTransitionId && related?.transitionsMap
              ? (related.transitionsMap[
                  group.twinflowTransitionId
                ] as TwinFlowTransition)
              : undefined,
          viewPermission:
            group.viewPermissionId && related?.permissionMap
              ? (related.permissionMap[group.viewPermissionId] as Permission)
              : undefined,
          author:
            group.createdByUserId && related?.userMap
              ? (related.userMap[group.createdByUserId] as User)
              : undefined,
          comment:
            group.twinCommentId && related?.commentMap
              ? (related.commentMap[group.twinCommentId] as Comment)
              : undefined,
          twinClassField:
            group.twinClassFieldId && related?.twinClassFieldMap
              ? (related.twinClassFieldMap[
                  group.twinClassFieldId
                ] as TwinClassField)
              : undefined,
        }));

        return {
          items,
          total: data.pagination?.total ?? items.length,
        };
      } catch {
        throw new Error("An error occured while counting attachments");
      }
    },
    [api]
  );

  return { countAttachment };
}
