import { useFormContext } from "react-hook-form";

import { ComboboxFormField } from "@/components/form-fields";

import { useTwinClassFields } from "@/entities/twin";
import { isPopulatedArray } from "@/shared/libs";

import { Foobar, SelectedOptionProps } from "../tc001-form";
import { useSyncFormFields } from "../utils";

export function SilentModeForm() {
  const form = useFormContext<Foobar>();

  const selectedOptions = form.watch("optionId");
  const firstOption = isPopulatedArray<SelectedOptionProps>(selectedOptions)
    ? selectedOptions[0]
    : undefined;

  useSyncFormFields({
    form,
    fromKey: "optionId",
    toKey: "headTwinId",
    merge: (fromValue, _) => fromValue?.[0].pointedHeadTwinId,
  });

  console.log("foobar render#", firstOption);

  const { twinClassBySearchIdAdapter } = useTwinClassFields(form.control, {
    baseTwinClassId: firstOption?.twinClassSearchId,
    twinClassSearchParams: firstOption?.twinClassSearchParams,
  });

  return (
    <div className="space-y-8">
      {firstOption?.twinClassSearchId && (
        <ComboboxFormField
          control={form.control}
          name="classId"
          label={firstOption.classSelectorLabel || "Select class"}
          {...twinClassBySearchIdAdapter}
          required
        />
      )}
    </div>
  );
}
