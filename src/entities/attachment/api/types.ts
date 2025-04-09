import { Comment_DETAILED } from "@/entities/comment";
import { Permission } from "@/entities/permission";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { Twin } from "@/entities/twin/server";
import { User } from "@/entities/user";
import { components, operations } from "@/shared/api/generated/schema";

export type Attachment = components["schemas"]["AttachmentV1"];
export type Attachment_DETAILED = Required<
  Attachment & {
    twin: Twin;
    twinClassField: TwinClassField_DETAILED;
    twinflowTransition: TwinFlowTransition_DETAILED;
    viewPermission: Permission;
    authorUser: User;
    comment: Comment_DETAILED;
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
  | "createdAt";

export type AttachmentFilters = Partial<
  Pick<components["schemas"]["AttachmentSearchRqV1"], AttachmentFilterKeys>
>;
