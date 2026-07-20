import { Control, useWatch } from "react-hook-form";

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
import {
  usePermissionFilters,
  usePermissionSelectAdapterWithFilters,
} from "@/entities/permission";
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
  const viewPermissionAdapter = usePermissionSelectAdapterWithFilters();
  const editPermissionAdapter = usePermissionSelectAdapterWithFilters();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();

  const {
    buildFilterFields: buildPermissionFilters,
    mapFiltersToPayload: mapPermissionFilters,
  } = usePermissionFilters();

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

  const viewPermissionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "View permission",
    adapter: viewPermissionAdapter,
    extraFilters: buildPermissionFilters(),
    mapExtraFilters: (filters) => mapPermissionFilters(filters),
    searchPlaceholder: "Search view permission...",
    selectPlaceholder: "Select view permission",
    multi: false,
  };

  const editPermissionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Edit permission",
    adapter: editPermissionAdapter,
    extraFilters: buildPermissionFilters(),
    mapExtraFilters: (filters) => mapPermissionFilters(filters),
    searchPlaceholder: "Search edit permission...",
    selectPlaceholder: "Select edit permission",
    multi: false,
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

      <ComplexComboboxFormField
        control={control}
        name="viewPermissionId"
        info={viewPermissionInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="editPermissionId"
        info={editPermissionInfo}
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
