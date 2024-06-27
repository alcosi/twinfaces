import {components, paths} from "@/lib/api/generated/schema";

export type TwinClass = components["schemas"]["TwinClassV1"];
export type TwinClassCreateRequestBody = paths['/private/twin_class/v1']['post']['requestBody']['content']["application/json"]

export type TwinClassField = components["schemas"]["TwinClassFieldV1"];
export type TwinClassStatus = components["schemas"]["TwinStatusV1"];
export type TwinClassStatusCreateRequestBody = components["schemas"]["TwinStatusCreateRqV1"];
export type TwinClassStatusUpdateRequestBody = components["schemas"]["TwinStatusUpdateRqV1"];