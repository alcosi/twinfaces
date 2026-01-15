import { FaceNB001 } from "@/entities/face";
import { Featurer } from "@/entities/featurer";
import { PermissionSchema } from "@/entities/permission-schema";
import { Tier } from "@/entities/tier";
import { TwinClassSchema } from "@/entities/twin-class-schema";
import { Twin } from "@/entities/twin/server";
import { components, operations } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinClassOwnerType = components["schemas"]["TwinClassOwnerTypeV1"];

export type DomainView = components["schemas"]["DomainViewV1"];
export type DomainView_SHORT = RequireFields<DomainView, "id" | "key" | "name">;
export type DomainView_DETAILED = RequireFields<
  DomainView_SHORT,
  | "businessAccountTemplateTwinId"
  | "createdAt"
  | "defaultLocale"
  | "description"
  | "navbarFaceId"
  | "permissionSchemaId"
  | "twinClassSchemaId"
  | "twinflowSchemaId"
  | "type"
> & {
  businessAccountInitiatorFeaturer: Featurer;
  userGroupManagerFeaturer: Featurer;
  permissionSchema: PermissionSchema;
  twinClassSchema: TwinClassSchema;
  twin: Twin;
  tier: Tier;
  navbarFace: FaceNB001;
  domainUserTemplateTwin: Twin;
};

export type DomainPublicView = components["schemas"]["DomainViewPublicV1"];

export type DomainAddRqV1 = components["schemas"]["DomainCreateRqV1"];
export type DomainViewPublicQuery =
  operations["domainViewPublicV1"]["parameters"]["query"];
export type DomainViewQuery = operations["domainViewV1"]["parameters"]["query"];
export type DomainUpdateRq = components["schemas"]["DomainUpdateRqV1"];
export type LocaleV1 = components["schemas"]["LocaleV1"];

export type DomainViewRs = components["schemas"]["DomainViewRsv1"];
export type DomainSearchRs = components["schemas"]["DomainSearchRsV1"];
