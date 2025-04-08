import { useState } from "react";
import { Control, useWatch } from "react-hook-form";

import {
  CheckboxFormField,
  CheckboxFormItem,
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { useDatalistSelectAdapter } from "@/entities/datalist";
import { useTwinClassOwnerTypeSelectAdapter } from "@/entities/domain";
import { FeaturerTypes } from "@/entities/featurer";
import { usePermissionSelectAdapter } from "@/entities/permission";
import {
  TwinClassFieldValues,
  useTwinClassSelectAdapter,
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

  const tcAdapter = useTwinClassSelectAdapter();
  const dlAdapter = useDatalistSelectAdapter();
  const pAdapter = usePermissionSelectAdapter();
  const twinClassOwnerTypeAdapter = useTwinClassOwnerTypeSelectAdapter();

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
        {...twinClassOwnerTypeAdapter}
      />

      <CheckboxFormField
        control={control}
        name="abstractClass"
        label="Is abstract"
      />

      <TextFormField control={control} name="logo" label="Logo URL" />

      <ComboboxFormField
        control={control}
        name="headTwinClass"
        label="Head"
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...tcAdapter}
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

      <ComboboxFormField
        control={control}
        name="extendsTwinClassId"
        label="Extends"
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...tcAdapter}
      />

      <ComboboxFormField
        control={control}
        name="markerDataListId"
        label="Markers list"
        selectPlaceholder="Select datalist"
        searchPlaceholder="Search datalist..."
        noItemsText="No datalist found"
        {...dlAdapter}
      />

      <ComboboxFormField
        control={control}
        name="tagDataListId"
        label="Tags list"
        selectPlaceholder="Select datalist"
        searchPlaceholder="Search datalist..."
        noItemsText="No datalist found"
        {...dlAdapter}
      />

      <CheckboxFormField
        control={control}
        name="autoCreatePermissions"
        label="Auto create permissions"
        onClick={() => setIsAutoCreatePermission((prev) => !prev)}
      />

      {isFalsy(isAutoCreatePermission) && (
        <fieldset className="px-1.5 py-2.5 rounded-md border border-dashed">
          <legend className="text-sm font-medium italic">Permissions</legend>
          <ComboboxFormField
            control={control}
            name="createPermissionId"
            label="Create"
            selectPlaceholder="Select create permission"
            searchPlaceholder="Search create permission..."
            noItemsText="No create permission found"
            {...pAdapter}
          />

          <ComboboxFormField
            control={control}
            name="viewPermissionId"
            label="View"
            selectPlaceholder="Select view permission"
            searchPlaceholder="Search view permission..."
            noItemsText="No view permission found"
            {...pAdapter}
          />

          <ComboboxFormField
            control={control}
            name="editPermissionId"
            label="Edit"
            selectPlaceholder="Select edit permission"
            searchPlaceholder="Search edit permission..."
            noItemsText="No edit permission found"
            {...pAdapter}
          />

          <ComboboxFormField
            control={control}
            name="deletePermissionId"
            label=" Delete"
            selectPlaceholder="Select delete permission"
            searchPlaceholder="Search delete permission..."
            noItemsText="No delete permission found"
            {...pAdapter}
          />
        </fieldset>
      )}

      <CheckboxFormItem
        fieldValue={isSpaceChecked}
        label="Space"
        name="space"
        onClick={() => setIsSpaceChecked((prev) => !prev)}
      />

      {isSpaceChecked && (
        <fieldset className="px-1.5 py-2.5 rounded-md border border-dashed flex flex-col gap-4">
          <legend className="text-sm font-medium italic">Spaces</legend>
          <CheckboxFormField
            control={control}
            name="permissionSchemaSpace"
            label="Permission schema space"
          />

          <CheckboxFormField
            control={control}
            name="twinflowSchemaSpace"
            label="Twinflow schema space"
          />

          <CheckboxFormField
            control={control}
            name="twinClassSchemaSpace"
            label="Twin class schema space"
          />

          <CheckboxFormField
            control={control}
            name="aliasSpace"
            label="Alias space"
          />
        </fieldset>
      )}
    </>
  );
}
