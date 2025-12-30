import { z } from "zod";

import { FIRST_ID_EXTRACTOR, isPopulatedArray } from "@/shared/libs";

import { LauncherType, LauncherTypesEnum } from "./types";

export const LAUNCHER_TYPES_SCHEMA = z.enum(
  [
    LauncherTypesEnum.transition,
    LauncherTypesEnum.factoryPipeline,
    LauncherTypesEnum.targetDeletion,
    LauncherTypesEnum.cascadeDeletion,
    LauncherTypesEnum.onTwinCreate,
    LauncherTypesEnum.onTwinUpdate,
    LauncherTypesEnum.onSketchCreate,
    LauncherTypesEnum.onSketchUpdate,
    LauncherTypesEnum.onSketchFinalize,
    LauncherTypesEnum.afterTwinCreate,
    LauncherTypesEnum.afterTwinUpdate,
    LauncherTypesEnum.afterSketchCreate,
    LauncherTypesEnum.afterSketchUpdate,
    LauncherTypesEnum.afterSketchFinalize,
    LauncherTypesEnum.afterSketchFinalizeRestricted,
    LauncherTypesEnum.afterTransitionPerform,
  ],
  { message: "Invalid type" }
);

export const LAUNCHER_TYPES_ENUM: Array<{
  id: LauncherType;
  label: string;
}> = [
  { id: LauncherTypesEnum.transition, label: "Transition" },
  { id: LauncherTypesEnum.factoryPipeline, label: "Factory Pipeline" },
  { id: LauncherTypesEnum.targetDeletion, label: "Target Deletion" },
  { id: LauncherTypesEnum.cascadeDeletion, label: "Cascade Deletion" },
  { id: LauncherTypesEnum.onTwinCreate, label: "On Twin Create" },
  { id: LauncherTypesEnum.onTwinUpdate, label: "On Twin Update" },
  { id: LauncherTypesEnum.onSketchCreate, label: "On Sketch Create" },
  { id: LauncherTypesEnum.onSketchUpdate, label: "On Sketch Update" },
  { id: LauncherTypesEnum.onSketchFinalize, label: "On Sketch Finalize" },
  { id: LauncherTypesEnum.afterTwinCreate, label: "After Twin Create" },
  { id: LauncherTypesEnum.afterTwinUpdate, label: "After Twin Update" },
  { id: LauncherTypesEnum.afterSketchCreate, label: "After Sketch Create" },
  { id: LauncherTypesEnum.afterSketchUpdate, label: "After Sketch Update" },
  { id: LauncherTypesEnum.afterSketchFinalize, label: "After Sketch Finalize" },
  {
    id: LauncherTypesEnum.afterSketchFinalizeRestricted,
    label: "After Sketch Finalize Restricted",
  },
  {
    id: LauncherTypesEnum.afterTransitionPerform,
    label: "After Transition Perform",
  },
] as const;

export const TWINFLOW_FACTORY_SCHEMA = z.object({
  twinflowId: z.string().uuid().or(FIRST_ID_EXTRACTOR),
  twinFactoryLauncherId: z
    .array(z.object({ id: LAUNCHER_TYPES_SCHEMA }))
    .min(1, "Required")
    .transform<LauncherType>((arr) =>
      isPopulatedArray<{ id: string }>(arr)
        ? (arr[0].id as LauncherType)
        : LauncherTypesEnum.afterSketchCreate
    )
    .or(LAUNCHER_TYPES_SCHEMA),
  factoryId: z.string().uuid().or(FIRST_ID_EXTRACTOR),
});
