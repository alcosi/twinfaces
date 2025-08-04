import { useEffect } from "react";
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
  useWatch,
} from "react-hook-form";

import {
  TWIN_SELF_FIELD_ID_TO_KEY_MAP,
  TwinFormValues,
  TwinSelfFieldId,
} from "@/entities/twin";
import { TwinClassField } from "@/entities/twin-class-field";
import { isPopulatedArray } from "@/shared/libs";

import { TwinFieldFormField } from "../../../../form-fields";
import { Foobar } from "./tc001-form";

type BuildFieldElementsParams = {
  fields: TwinClassField[];
  control: Control<Foobar>; // ???? 👀
  selectedClass: unknown;
};

export function buildFieldElements({
  fields,
  control,
  selectedClass,
}: BuildFieldElementsParams) {
  return fields.map((field) => {
    const selfTwinFieldKey =
      TWIN_SELF_FIELD_ID_TO_KEY_MAP[field.id as TwinSelfFieldId];

    return (
      <TwinFieldFormField
        key={field.key}
        name={selfTwinFieldKey ?? `fields.${field.key}`}
        control={control}
        label={field.name}
        descriptor={field.descriptor}
        twinClassId={
          isPopulatedArray<{ id: string }>(selectedClass)
            ? selectedClass[0]?.id
            : ""
        }
        required={field.required}
      />
    );
  });
}

type UseSyncFormParams<
  T extends FieldValues,
  K1 extends keyof T,
  K2 extends keyof T,
> = {
  form: UseFormReturn<T>;
  fromKey: K1;
  toKey: K2;
  merge?: (fromValue: T[K1], toValue: T[K2]) => T[K1] | T[K2];
};

// TEMP
export const useSyncFormFields = <
  T extends FieldValues,
  K1 extends keyof T,
  K2 extends keyof T,
>({
  form,
  fromKey,
  toKey,
  merge = (a, _b) => a,
}: UseSyncFormParams<T, K1, K2>) => {
  const fromValue = useWatch<T>({
    control: form.control,
    name: fromKey as unknown as Path<T>,
  });

  useEffect(() => {
    const toValue = form.getValues(toKey as unknown as Path<T>);

    form.setValue(
      toKey as unknown as Path<T>,
      merge(
        fromValue as PathValue<T, Path<T>>,
        toValue as PathValue<T, Path<T>>
      )
    );
    // merge should not be a dependency, because it is a function that is not supposed to change
    // and if we place it here, we would have to always wrap it in useCallback before passing it to this hook
    // which is not very convenient
    // @eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromValue, form.setValue, fromKey, toKey]);
};
