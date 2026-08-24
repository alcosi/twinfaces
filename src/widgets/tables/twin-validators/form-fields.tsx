import { useRef } from "react";
import { Control, useWatch } from "react-hook-form";
import { z } from "zod";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import {
  SwitchFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { FeaturerTypes } from "@/entities/featurer";
import { TWIN_VALIDATOR_SCHEMA } from "@/entities/twin-validator";
import {
  useValidatorSetFilters,
  useValidatorSetSelectAdapterWithFilters,
} from "@/entities/validator-set";
import { isTruthy } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";

export function TwinValidatorFormFields({
  control,
  twinValidatorSetId,
}: {
  control: Control<z.infer<typeof TWIN_VALIDATOR_SCHEMA>>;
  /** Locks the validator-set picker when the parent set is already known. */
  twinValidatorSetId?: string;
}) {
  const validatorSetAdapter = useValidatorSetSelectAdapterWithFilters();
  const validatorSetWatch = useWatch({ control, name: "twinValidatorSetId" });
  const disabled = useRef(
    isTruthy(twinValidatorSetId || validatorSetWatch)
  ).current;

  const {
    buildFilterFields: buildValidatorSetFilters,
    mapFiltersToPayload: mapValidatorSetFilters,
  } = useValidatorSetFilters();

  const validatorSetInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Validator set",
    adapter: validatorSetAdapter,
    extraFilters: buildValidatorSetFilters(),
    mapExtraFilters: (filters) => mapValidatorSetFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select...",
    multi: false,
    disabled: disabled,
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinValidatorSetId"
        info={validatorSetInfo}
      />

      <FeaturerFormField
        typeId={FeaturerTypes.validator}
        control={control}
        label="Featurer"
        name="validatorFeaturerId"
        paramsFieldName="validatorParams"
      />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <SwitchFormField control={control} name="invert" label="Invert" />

      <SwitchFormField control={control} name="active" label="Active" />

      <TextFormField
        control={control}
        name="order"
        label="Order"
        type="number"
      />
    </>
  );
}
