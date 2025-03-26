import { Control, FieldValues, Path } from "react-hook-form";

import {
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { useTwinStatusSelectAdapter } from "@/entities/twin-status";
import { reduceToObject, toArray } from "@/shared/libs";

export function TwinClassTwinFlowFormFields<T extends FieldValues>({
  control,
  twinClassId,
}: {
  control: Control<T>;
  twinClassId: string;
}) {
  const sAdapter = useTwinStatusSelectAdapter();

  return (
    <>
      <TextFormField
        control={control}
        name={"name" as Path<T>}
        label="Name"
        autoFocus={true}
      />

      <TextAreaFormField
        control={control}
        name={"description" as Path<T>}
        label="Description"
      />

      <ComboboxFormField
        control={control}
        name={"initialStatusId" as Path<T>}
        label="Initial status"
        required={true}
        selectPlaceholder="Select status"
        searchPlaceholder="Search status..."
        noItemsText={"No statuses found"}
        {...sAdapter}
        getItems={async (search: string) =>
          sAdapter.getItems(search, {
            twinClassIdMap: reduceToObject({
              list: toArray(twinClassId),
              defaultValue: true,
            }),
          })
        }
      />
    </>
  );
}
