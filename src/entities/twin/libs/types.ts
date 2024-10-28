import { components } from "@/lib/api/generated/schema";
import { TwinClass_DETAILED } from "../../twinClass";

export type TwinBase = components["schemas"]["TwinV2"];

export type Twin = TwinBase & {
  twinClass?: TwinClass_DETAILED;
};
