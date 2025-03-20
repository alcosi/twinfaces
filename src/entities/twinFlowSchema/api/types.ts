import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinFlowSchema = components["schemas"]["TwinflowSchemaV1"];
export type TwinFlowSchema_DETAILED = RequireFields<
  TwinFlowSchema,
  "id" | "name" | "domainId" | "createdByUserId"
>;

export type TwinFlowSchemaFilterKeys = "idList" | "nameLikeList";
export type TwinFlowSchemaFilters = Partial<
  Pick<
    components["schemas"]["TwinflowSchemaSearchRqV1"],
    TwinFlowSchemaFilterKeys
  >
>;
