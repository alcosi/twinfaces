import { Control, useWatch } from "react-hook-form";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import {
  CheckboxFormField,
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { useFeaturerSelectAdapter } from "@/entities/featurer";
import { usePermissionSelectAdapter } from "@/entities/permission";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";

import { TwinClassFieldFormValues } from "./types";

export function TwinClassFieldFormFields({
  control,
}: {
  control: Control<TwinClassFieldFormValues>;
}) {
  const tcAdapter = useTwinClassSelectAdapterWithFilters();
  const twinClassId = useWatch({ control, name: "twinClassId" });
  const permissionAdapter = usePermissionSelectAdapter();
  const fieldTyperFeaturerAdapter = useFeaturerSelectAdapter(13);
  const twinSorterFeaturerAdapter = useFeaturerSelectAdapter(41);
  const fieldInitializerFeaturerAdapter = useFeaturerSelectAdapter(53);

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const twinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Class",
    adapter: tcAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search...",
    selectPlaceholder: "Select twin class",
    multi: false,
    disabled: isPopulatedString(twinClassId),
  };

  return (
    <>
      <ComplexComboboxFormField
        control={control}
        name="twinClassId"
        info={twinClassInfo}
      />

      <TextFormField control={control} name="key" label="Key" />

      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <CheckboxFormField control={control} name="required" label="Required" />

      <CheckboxFormField control={control} name="system" label="System" />

      <ComboboxFormField
        control={control}
        name="fieldTyperFeaturerId"
        label="Type"
        selectPlaceholder="Select type"
        searchPlaceholder="Search type..."
        noItemsText="No type found"
        {...fieldTyperFeaturerAdapter}
      />

      <ComboboxFormField
        control={control}
        name="twinSorterFeaturerId"
        label="Twin sorter"
        selectPlaceholder="Select twin sorter"
        searchPlaceholder="Search twin sorter..."
        noItemsText="No twin sorter found"
        {...twinSorterFeaturerAdapter}
      />

      <ComboboxFormField
        control={control}
        name="viewPermissionId"
        label="View permission"
        selectPlaceholder="Select view permission"
        searchPlaceholder="Search view permission..."
        noItemsText="No permission found"
        {...permissionAdapter}
      />

      <ComboboxFormField
        control={control}
        name="editPermissionId"
        label="Edit permission"
        selectPlaceholder="Select edit permission"
        searchPlaceholder="Search edit permission..."
        noItemsText="No permission found"
        {...permissionAdapter}
      />

      <TextFormField control={control} name="externalId" label="External Id" />

      <ComboboxFormField
        control={control}
        name="fieldInitializerFeaturerId"
        label="Field initializer"
        selectPlaceholder="Select field initializer"
        searchPlaceholder="Search field initializer..."
        noItemsText="No field initializer found"
        {...fieldInitializerFeaturerAdapter}
      />
    </>
  );
}
