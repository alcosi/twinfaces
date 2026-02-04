import { components } from "@/shared/api/generated/schema";

export type TwinClassSchema = components["schemas"]["TwinClassSchemaV1"];
export type TwinClassSchema_DETAILED = Required<TwinClassSchema>;

export type TwinClassSchemaFilterKeys = "idList" | "nameLikeList";
export type TwinClassSchemaFilters = Partial<
  Pick<
    components["schemas"]["TwinClassSchemaSearchV1"],
    TwinClassSchemaFilterKeys
  >
>;
