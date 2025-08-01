import { JSX } from "react";
import { Control, Path } from "react-hook-form";

import {
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { FaceTC001ViewRs } from "@/entities/face";
import { TwinFormValues, TwinSelfFieldId } from "@/entities/twin";
import { isEmptyArray } from "@/shared/libs";
import { ComboboxProps } from "@/shared/ui";

import { MultiModeForm } from "./forms/multi-mode";
import { SilentModeForm } from "./forms/silent-mode";

type TwinSelfFieldComponentProps<T = unknown> = {
  control: Control<TwinFormValues>;
  name: Path<TwinFormValues>;
  label: string;
  required?: boolean;
  adapter?: Partial<ComboboxProps<T>>;
};

export type TwinSelfFieldRenderer = (
  props: TwinSelfFieldComponentProps
) => JSX.Element;
type SelfFieldsMap = Partial<Record<TwinSelfFieldId, TwinSelfFieldRenderer>>;

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

  // TODO: this `selfFields` can be removed
  // after TwinFieldFormItem is implemented
  const selfFields: SelfFieldsMap = {
    "00000000-0000-0000-0011-000000000007": ({
      control,
      name,
      label,
      required,
      adapter,
    }) => (
      <ComboboxFormField
        control={control}
        name={name}
        label={label}
        {...(adapter as ComboboxProps<unknown>)}
        required={required}
      />
    ),
    "00000000-0000-0000-0011-000000000004": ({
      control,
      name,
      label,
      required,
    }) => (
      <TextAreaFormField
        control={control}
        name={name}
        label={label}
        required={required}
      />
    ),
    "00000000-0000-0000-0011-000000000003": ({
      control,
      name,
      label,
      required,
    }) => (
      <TextFormField
        control={control}
        name={name}
        label={label}
        required={required}
      />
    ),
    "00000000-0000-0000-0011-000000000005": ({
      control,
      name,
      label,
      required,
    }) => (
      <TextFormField
        control={control}
        name={name}
        label={label}
        required={required}
      />
    ),
  };

  const nameMap: Partial<Record<TwinSelfFieldId, Path<TwinFormValues>>> = {
    "00000000-0000-0000-0011-000000000003": "name",
    "00000000-0000-0000-0011-000000000007": "assignerUserId",
    "00000000-0000-0000-0011-000000000004": "description",
    "00000000-0000-0000-0011-000000000005": "externalId",
  };

  return isSilent ? (
    <SilentModeForm
      control={control}
      firstOption={variantOptions[0]!}
      selfFields={selfFields}
      nameMap={nameMap}
    />
  ) : (
    <MultiModeForm
      control={control}
      payload={payload}
      options={variantOptions}
      selfFields={selfFields}
      nameMap={nameMap}
    />
  );
}
