import { Control } from "react-hook-form";

import { FaceTC001ViewRs } from "@/entities/face";
import { TwinFormValues } from "@/entities/twin";
import { isEmptyArray } from "@/shared/libs";

import { MultiModeForm } from "./forms/multi-mode";
import { SilentModeForm } from "./forms/silent-mode";

export function TC001Form({
  control,
  payload,
}: {
  control: Control<TwinFormValues>;
  payload: FaceTC001ViewRs;
}) {
  const { faceTwinCreate } = payload;
  const variantOptions = faceTwinCreate?.options || [];
  const isSilent =
    faceTwinCreate?.singleOptionSilentMode && !isEmptyArray(variantOptions);

  return isSilent ? (
    <SilentModeForm control={control} firstOption={variantOptions[0]!} />
  ) : (
    <MultiModeForm
      control={control}
      payload={payload}
      options={variantOptions}
    />
  );
}
