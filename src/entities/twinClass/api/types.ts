import { components, paths } from "@/shared/api/generated/schema";

export type TwinClass = components["schemas"]["TwinClassV1"];
export type TwinClassCreateRq =
  paths["/private/twin_class/v1"]["post"]["requestBody"]["content"]["application/json"];
export type TwinClassUpdateRq = components["schemas"]["TwinClassUpdateRqV1"];
export type TwinClassField = components["schemas"]["TwinClassFieldV1"];
export type TwinClassFieldDescriptor =
  components["schemas"]["TwinClassFieldDescriptorDTO"];
export type TwinClassFieldCreateRq =
  components["schemas"]["TwinClassFieldCreateRqV1"];
export type TwinClassFieldUpdateRq =
  components["schemas"]["TwinClassFieldUpdateRqV1"];
// export type TwinClassFieldUpdateRq = components["schemas"]["TwinClassField"];
