import { Comment_DETAILED } from "@/entities/comment";
import { Permission } from "@/entities/permission";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import { TwinClassField_DETAILED } from "@/entities/twin-class-field";
import { TwinFlowTransition_DETAILED } from "@/entities/twin-flow-transition";
import { User } from "@/entities/user";
import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type Twin = components["schemas"]["TwinV2"] & { ownerUser?: User };
export type Twin_SHORT = RequireFields<
  Twin,
  | "id"
  | "name"
  | "assignerUserId"
  | "authorUserId"
  | "markerIdList"
  | "statusId"
  | "tagIdList"
  | "twinClassId"
>;
export type Twin_DETAILED = RequireFields<
  Twin_SHORT,
  "twinClass" | "createdAt" | "headTwinId" | "tags"
> & {
  subordinates?: TwinClass_DETAILED[];
};

export type TwinCreateRq = RequireFields<
  components["schemas"]["TwinCreateRqV2"],
  "classId" | "name" | "assignerUserId"
>;
export type TwinCreateRsV1 = components["schemas"]["TwinCreateRsV1"];
export type TwinUpdateRq = components["schemas"]["TwinUpdateRqV1"];
export type TwinViewQuery = operations["twinViewV2"]["parameters"]["query"];
export type TwinTagManageV1 = TwinUpdateRq["tagsUpdate"];

export type TwinLinkAddRqV1 = components["schemas"]["TwinLinkAddRqV1"];
export type HistoryV1 = components["schemas"]["HistoryV1"];

export type TwinFilterKeys =
  | "twinIdList"
  | "twinNameLikeList"
  | "twinClassIdList"
  | "statusIdList"
  | "descriptionLikeList"
  | "twinClassExtendsHierarchyContainsIdList"
  | "headTwinIdList"
  | "createdByUserIdList"
  | "assignerUserIdList";

export type TwinFilters = Partial<
  Pick<components["schemas"]["TwinSearchRqV1"], TwinFilterKeys>
>;

export type TwinSimpleFilters = components["schemas"]["TwinSearchSimpleV1"];

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

export type DataTimeRangeV1 = components["schemas"]["DataTimeRangeV1"];
