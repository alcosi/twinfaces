import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";
import { FeaturerTypes } from "@/entities/featurer";
import { useTwinClassSelectAdapter } from "@/entities/twinClass";
import { isPopulatedString } from "@/shared/libs";
import { Control, useWatch } from "react-hook-form";
import { FeaturerFormField } from "../../form-fields";
import { TwinClassFieldFormValues } from "./types";

export function TwinClassFieldFormFields({
  control,
}: {
  control: Control<TwinClassFieldFormValues>;
}) {
  const tcAdapter = useTwinClassSelectAdapter();
  const twinClassId = useWatch({ control, name: "twinClassId" });

  return (
    <>
      <ComboboxFormField
        control={control}
        name="twinClassId"
        label="Class"
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText="No classes found"
        disabled={isPopulatedString(twinClassId)}
        {...tcAdapter}
      />

      <TextFormField control={control} name="key" label="Key" />

      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <FeaturerFormField
        typeId={FeaturerTypes.fieldTyper}
        control={control}
        name="fieldTyperFeaturerId"
        label={"Featurer"}
      />

      <TextFormField
        control={control}
        name="viewPermissionId"
        label="View permission ID"
      />

      <TextFormField
        control={control}
        name="editPermissionId"
        label="Edit permission ID"
      />

      <CheckboxFormField control={control} name="required" label="Required" />
    </>
  );
}
