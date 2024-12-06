import { components } from "@/shared/api/generated/schema";
import { RequireFields } from "@/shared/libs";

export type TwinClassField = components["schemas"]["TwinClassFieldV1"];
export type TwinClassField_DETAILED = RequireFields<
  TwinClassField,
  "id" | "key" | "name" | "twinClassId"
>;

export type TwinClassFieldFilterKeys = "twinClassFieldList";
export type TwinClassFieldFilters = Partial<
  Pick<
    components["schemas"]["TwinClassFieldListRsV1"],
    TwinClassFieldFilterKeys
  >
>;

export type TwinClassFieldDescriptor =
  components["schemas"]["TwinClassFieldDescriptorDTO"];
export type TwinClassFieldCreateRq =
  components["schemas"]["TwinClassFieldCreateRqV1"];
export type TwinClassFieldUpdateRq =
  components["schemas"]["TwinClassFieldUpdateRqV1"];
// export type TwinClassFieldUpdateRq = components["schemas"]["TwinClassField"];
