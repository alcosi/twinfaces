import { useFormContext } from "react-hook-form";

import { ComboboxFormField } from "@/components/form-fields";

import { useTwinClassFields } from "@/entities/twin";
import { isPopulatedArray } from "@/shared/libs";

import { Foobar, SelectedOptionProps } from "../tc001-form";
import { useSyncFormFields } from "../utils";

export function MultiModeForm() {
  const form = useFormContext<Foobar>();
  const selectedOptions = form.watch("optionId");

  const selectedOption = isPopulatedArray<SelectedOptionProps>(selectedOptions)
    ? selectedOptions[0]
    : undefined;

  const { twinClassBySearchIdAdapter } = useTwinClassFields<Foobar>(
    form.control,
    {
      baseTwinClassId: selectedOption?.twinClassSearchId,
      twinClassSearchParams: selectedOption?.twinClassSearchParams,
    }
  );

  useSyncFormFields({
    form,
    fromKey: "optionId",
    toKey: "headTwinId",
    merge: (fromValue, _) => fromValue?.[0].pointedHeadTwinId,
  });

  return (
    <div className="space-y-8">
      {selectedOption?.twinClassSearchId && (
        <ComboboxFormField
          control={form.control}
          name="classId"
          label={selectedOptions[0].classSelectorLabel || "Select class"}
          {...twinClassBySearchIdAdapter}
          required
        />
      )}
    </div>
  );
}
