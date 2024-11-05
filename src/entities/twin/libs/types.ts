import { TwinClass_DETAILED } from "../../twinClass";
import { TwinBase } from "../api";

export type Twin = TwinBase & {
  twinClass?: TwinClass_DETAILED;
};
