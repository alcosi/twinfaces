import { useFormContext } from "react-hook-form";

import { ComboboxFormField } from "@/components/form-fields";

import { useTwinClassFields } from "@/entities/twin";
import { isPopulatedArray, isTruthy } from "@/shared/libs";

import { Foobar } from "../tc001-form";
import { useSyncFormFields } from "../utils";

export function MultiModeForm() {
  const form = useFormContext<Foobar>();
  const selectedOptions = form.watch("optionId");

  const { twinClassBySearchIdAdapter } = useTwinClassFields(form.control, {
    baseTwinClassId: isPopulatedArray<any>(selectedOptions)
      ? selectedOptions[0].twinClassSearchId
      : undefined,
    twinClassSearchParams: isPopulatedArray<any>(selectedOptions)
      ? selectedOptions[0].twinClassSearchParams
      : undefined,
  });

  useSyncFormFields({
    form,
    fromKey: "optionId",
    toKey: "headTwinId",
    merge: (fromValue, _) => fromValue?.pointedHeadTwinId,
  });

  return (
    <div className="space-y-8">
      {isPopulatedArray<any>(selectedOptions) &&
        isTruthy(selectedOptions[0].twinClassSearchId) && (
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
