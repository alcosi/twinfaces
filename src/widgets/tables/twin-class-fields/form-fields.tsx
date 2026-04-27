import { Control, useWatch } from "react-hook-form";

import {
  AutoFormComplexComboboxValueInfo,
  AutoFormValueType,
} from "@/components/auto-field";
import { ComplexComboboxFormField } from "@/components/complex-combobox";
import {
  ComboboxFormField,
  SwitchFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { FeaturerTypes } from "@/entities/featurer";
import { usePermissionSelectAdapter } from "@/entities/permission";
import {
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { isPopulatedString } from "@/shared/libs";

import { FeaturerFormField } from "../../form-fields";
import { TwinClassFieldFormValues } from "./types";

export function TwinClassFieldFormFields({
  control,
}: {
  control: Control<TwinClassFieldFormValues>;
}) {
  const tcAdapter = useTwinClassSelectAdapterWithFilters();
  const twinClassId = useWatch({ control, name: "twinClassId" });
  const permissionAdapter = usePermissionSelectAdapter();

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

      <SwitchFormField control={control} name="required" label="Required" />

      <SwitchFormField control={control} name="system" label="System" />

      <FeaturerFormField
        typeId={FeaturerTypes.fieldTyper}
        control={control}
        label="Type"
        name="fieldTyperFeaturerId"
        paramsFieldName="fieldTyperParams"
      />

      <FeaturerFormField
        typeId={FeaturerTypes.sorter}
        control={control}
        label="Twin sorter"
        name="twinSorterFeaturerId"
        paramsFieldName="twinSorterParams"
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

      <FeaturerFormField
        typeId={FeaturerTypes.initializer}
        control={control}
        label="Field initializer"
        name="fieldInitializerFeaturerId"
        paramsFieldName="fieldInitializerParams"
      />
    </>
  );
}
