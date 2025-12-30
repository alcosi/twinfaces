import { createEnum } from "@/shared/libs";

import { TwinFlowFactory } from "../api";

export type LauncherType = NonNullable<
  TwinFlowFactory["twinFactoryLauncherId"]
>;
export const LAUNCHER_TYPES: LauncherType[] = [
  "transition",
  "factoryPipeline",
  "targetDeletion",
  "cascadeDeletion",
  "onTwinCreate",
  "onTwinUpdate",
  "onSketchCreate",
  "onSketchUpdate",
  "onSketchFinalize",
  "afterTwinCreate",
  "afterTwinUpdate",
  "afterSketchCreate",
  "afterSketchUpdate",
  "afterSketchFinalize",
  "afterSketchFinalizeRestricted",
  "afterTransitionPerform",
] as const;
export const LauncherTypesEnum = createEnum<LauncherType>(LAUNCHER_TYPES);
