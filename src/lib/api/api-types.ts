import {components, paths} from "@/lib/api/generated/schema";

export type TwinClass = components["schemas"]["TwinClassV1"];
export type TwinClassCreateRq = paths['/private/twin_class/v1']['post']['requestBody']['content']["application/json"]

export type TwinClassField = components["schemas"]["TwinClassFieldV1"];
export type TwinClassFieldDescriptor = components["schemas"]["TwinClassFieldDescriptorDTO"];
export type TwinClassFieldCreateRq = components["schemas"]["TwinClassFieldCreateRqV1"];
// export type TwinClassFieldUpdateRq = components["schemas"]["TwinClassField"];
export type TwinClassStatus = components["schemas"]["TwinStatusV1"];
export type TwinClassStatusCreateRq = components["schemas"]["TwinStatusCreateRqV1"];
export type TwinClassStatusUpdateRq = components["schemas"]["TwinStatusUpdateRqV1"];

export type Featurer = components["schemas"]["FeaturerV1"];
export type FeaturerParam = components["schemas"]["FeaturerParamV1"];