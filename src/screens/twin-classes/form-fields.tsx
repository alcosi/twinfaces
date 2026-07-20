import { useState } from "react";
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

import {
  useDatalistFilters,
  useDatalistSelectAdapterWithFilters,
} from "@/entities/datalist";
import { useTwinClassOwnerTypeSelectAdapter } from "@/entities/domain";
import { FeaturerTypes } from "@/entities/featurer";
import {
  usePermissionFilters,
  usePermissionSelectAdapterWithFilters,
} from "@/entities/permission";
import {
  TwinClassFieldValues,
  useTwinClassFilters,
  useTwinClassSelectAdapterWithFilters,
} from "@/entities/twin-class";
import { isFalsy, isPopulatedArray } from "@/shared/libs";
import { FeaturerFormField } from "@/widgets/form-fields";

export function TwinClassFormFields({
  control,
}: {
  control: Control<TwinClassFieldValues>;
}) {
  const headTwinClass = useWatch({
    control,
    name: "headTwinClass",
    defaultValue: [],
  });

  const headTwinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const extendsTwinClassAdapter = useTwinClassSelectAdapterWithFilters();
  const markerDatalistAdapter = useDatalistSelectAdapterWithFilters();
  const tagDatalistAdapter = useDatalistSelectAdapterWithFilters();
  const createPermissionAdapter = usePermissionSelectAdapterWithFilters();
  const viewPermissionAdapter = usePermissionSelectAdapterWithFilters();
  const twinClassOwnerTypeAdapter = useTwinClassOwnerTypeSelectAdapter();

  const {
    buildFilterFields: buildTwinClassFilters,
    mapFiltersToPayload: mapTwinClassFilters,
  } = useTwinClassFilters();
  const {
    buildFilterFields: buildDatalistFilters,
    mapFiltersToPayload: mapDatalistFilters,
  } = useDatalistFilters();
  const {
    buildFilterFields: buildPermissionFilters,
    mapFiltersToPayload: mapPermissionFilters,
  } = usePermissionFilters();

  const headTwinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Head",
    adapter: headTwinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search twin class...",
    selectPlaceholder: "Select twin class",
    multi: false,
  };

  const extendsTwinClassInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Extends",
    adapter: extendsTwinClassAdapter,
    extraFilters: buildTwinClassFilters(),
    mapExtraFilters: (filters) => mapTwinClassFilters(filters),
    searchPlaceholder: "Search twin class...",
    selectPlaceholder: "Select twin class",
    multi: false,
  };

  const markerDataListInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Markers list",
    adapter: markerDatalistAdapter,
    extraFilters: buildDatalistFilters(),
    mapExtraFilters: (filters) => mapDatalistFilters(filters),
    searchPlaceholder: "Search datalist...",
    selectPlaceholder: "Select datalist",
    multi: false,
  };

  const tagDataListInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Tags list",
    adapter: tagDatalistAdapter,
    extraFilters: buildDatalistFilters(),
    mapExtraFilters: (filters) => mapDatalistFilters(filters),
    searchPlaceholder: "Search datalist...",
    selectPlaceholder: "Select datalist",
    multi: false,
  };

  const createPermissionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "Create",
    adapter: createPermissionAdapter,
    extraFilters: buildPermissionFilters(),
    mapExtraFilters: (filters) => mapPermissionFilters(filters),
    searchPlaceholder: "Search create permission...",
    selectPlaceholder: "Select create permission",
    multi: false,
  };

  const viewPermissionInfo: AutoFormComplexComboboxValueInfo = {
    type: AutoFormValueType.complexCombobox,
    label: "View",
    adapter: viewPermissionAdapter,
    extraFilters: buildPermissionFilters(),
    mapExtraFilters: (filters) => mapPermissionFilters(filters),
    searchPlaceholder: "Search view permission...",
    selectPlaceholder: "Select view permission",
    multi: false,
  };

  const [isSpaceChecked, setIsSpaceChecked] = useState<boolean>(false);
  const [isAutoCreatePermission, setIsAutoCreatePermission] =
    useState<boolean>(true);

  return (
    <>
      <TextFormField
        control={control}
        name="key"
        label="Key"
        autoFocus={true}
        required
      />

      <TextFormField control={control} name="name" label="Name" />

      <TextAreaFormField
        control={control}
        name="description"
        label="Description"
      />

      <ComboboxFormField
        control={control}
        name="ownerType"
        label="Owner type"
        selectPlaceholder="Select owner type"
        searchPlaceholder="Search owner type..."
        noItemsText="No owner type found"
        required
        {...twinClassOwnerTypeAdapter}
      />

      <SwitchFormField
        control={control}
        name="abstractClass"
        label="Is abstract"
      />

      <SwitchFormField control={control} name="segment" label="Is segment" />

      <SwitchFormField
        control={control}
        name="assigneeRequired"
        label="Is assignee required"
      />

      <TextFormField control={control} name="logo" label="Logo URL" />

      <ComplexComboboxFormField
        control={control}
        name="headTwinClass"
        info={headTwinClassInfo}
      />

      {isPopulatedArray(headTwinClass) && (
        <FeaturerFormField
          typeId={FeaturerTypes.headHunter}
          control={control}
          name="headHunterFeaturerId"
          label="Head Hunter"
          paramsFieldName="headHunterParams"
        />
      )}

      <ComplexComboboxFormField
        control={control}
        name="extendsTwinClassId"
        info={extendsTwinClassInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="markerDataListId"
        info={markerDataListInfo}
      />

      <ComplexComboboxFormField
        control={control}
        name="tagDataListId"
        info={tagDataListInfo}
      />

      <SwitchFormField
        control={control}
        name="autoCreateTwinflow"
        label="Auto create Twinflow"
      />

      <SwitchFormField
        control={control}
        name="uniqueName"
        label="Unique name"
      />

      <SwitchFormField
        control={control}
        name="autoCreatePermissions"
        label="Auto create permissions"
        onClick={() => setIsAutoCreatePermission((prev) => !prev)}
      />

      {isFalsy(isAutoCreatePermission) && (
        <fieldset className="rounded-md border border-dashed px-1.5 py-2.5">
          <legend className="text-sm font-medium italic">Permissions</legend>
          <ComplexComboboxFormField
            control={control}
            name="createPermissionId"
            info={createPermissionInfo}
          />

          <ComplexComboboxFormField
            control={control}
            name="viewPermissionId"
            info={viewPermissionInfo}
          />
        </fieldset>
      )}

      <SwitchFormField
        control={control}
        name="space"
        label="Space"
        onClick={() => setIsSpaceChecked((prev) => !prev)}
      />

      {isSpaceChecked && (
        <fieldset className="flex flex-col gap-4 rounded-md border border-dashed px-1.5 py-2.5">
          <legend className="text-sm font-medium italic">Spaces</legend>
          <SwitchFormField
            control={control}
            name="permissionSchemaSpace"
            label="Permission schema space"
          />

          <SwitchFormField
            control={control}
            name="twinflowSchemaSpace"
            label="Twinflow schema space"
          />

          <SwitchFormField
            control={control}
            name="twinClassSchemaSpace"
            label="Twin class schema space"
          />

          <SwitchFormField
            control={control}
            name="aliasSpace"
            label="Alias space"
          />
        </fieldset>
      )}
    </>
  );
}
