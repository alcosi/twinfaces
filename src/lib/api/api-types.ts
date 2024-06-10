import {components, paths} from "@/lib/api/generated/schema";

export type TwinClass = components["schemas"]["TwinClassV1"];
export type TwinClassCreateRequestBody = paths['/private/twin_class/v1']['post']['requestBody']['content']["application/json"]