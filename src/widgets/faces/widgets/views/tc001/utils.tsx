import { useEffect } from "react";
import {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
  useWatch,
} from "react-hook-form";

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
  }, [fromValue, form.setValue, fromKey, toKey]);
};
