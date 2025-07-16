import { Comment } from "@/entities/comment";
import { Permission } from "@/entities/permission";
import { TwinClassField } from "@/entities/twin-class-field";
import { TwinFlowTransition } from "@/entities/twin-flow-transition";
import { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { components, operations } from "@/shared/api/generated/schema";

export type Attachment = components["schemas"]["AttachmentV1"];
export type Attachment_DETAILED = Required<
  Attachment & {
    twin: Twin;
    twinClassField: TwinClassField;
    twinflowTransition: TwinFlowTransition;
    viewPermission: Permission;
    authorUser: User;
    comment: Comment;
  }
>;

export type AttachmentSearchRqV1 =
  components["schemas"]["AttachmentSearchRqV1"];

export type AttachmentRqQuery =
  operations["attachmentViewV1"]["parameters"]["query"];

export type AttachmentFilterKeys =
  | "idList"
  | "twinIdList"
  | "externalIdLikeList"
  | "twinflowTransitionIdList"
  | "storageLinkLikeList"
  | "createdByUserIdList"
  | "titleLikeList"
  | "descriptionLikeList"
  | "viewPermissionIdList"
  | "twinClassFieldIdList"
  | "createdAtFrom"
  | "createdAtTo";

export type AttachmentFilters = Partial<
  Pick<
    components["schemas"]["AttachmentSearchRqV1"] & {
      createdAtFrom: string;
      createdAtTo: string;
    },
    AttachmentFilterKeys
  >
>;
