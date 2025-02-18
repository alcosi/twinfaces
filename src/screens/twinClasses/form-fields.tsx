import {
  CheckboxFormField,
  CheckboxFormItem,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";
import { ComboboxFormField } from "@/components/form-fields/combobox";
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
import { useState } from "react";
import { Control, Path, PathValue, useWatch } from "react-hook-form";

export function TwinClassFormFields<T extends TwinClassFieldValues>({
  control,
}: {
  control: Control<T>;
}) {
  const headTwinClass = useWatch<T>({
    control,
    name: "headTwinClass" as Path<T>,
    // TODO: Fix type for `defaultValue`, ensuring it matches `PathValue<T, "headTwinClass">`.
    defaultValue: [] as PathValue<T, any>,
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
        name={"key" as Path<T>}
        label="Key"
        autoFocus={true}
      />

      <TextFormField control={control} name={"name" as Path<T>} label="Name" />

      <TextAreaFormField
        control={control}
        name={"description" as Path<T>}
        label="Description"
      />

      <ComboboxFormField
        control={control}
        name={"twinClassOwnerTypes" as Path<T>}
        label="Owner type"
        selectPlaceholder="Select owner type"
        searchPlaceholder="Search owner type..."
        noItemsText="No owner type found"
        {...twinClassOwnerTypeAdapter}
      />

      <CheckboxFormField
        control={control}
        name={"abstractClass" as Path<T>}
        label="Is abstract"
      />

      <TextFormField
        control={control}
        name={"logo" as Path<T>}
        label="Logo URL"
      />

      <ComboboxFormField
        control={control}
        name={"headTwinClass" as Path<T>}
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
          name={"headHunterFeaturer" as Path<T>}
          label="Head Hunter"
          paramsFieldName="headHunterParams"
        />
      )}

      <ComboboxFormField
        control={control}
        name={"extendsTwinClassId" as Path<T>}
        label="Extends"
        selectPlaceholder="Select twin class"
        searchPlaceholder="Search twin class..."
        noItemsText={"No classes found"}
        {...tcAdapter}
      />

      <ComboboxFormField
        control={control}
        name={"markerDataListId" as Path<T>}
        label="Markers list"
        selectPlaceholder="Select datalist"
        searchPlaceholder="Search datalist..."
        noItemsText="No datalist found"
        {...dlAdapter}
      />

      <ComboboxFormField
        control={control}
        name={"tagDataListId" as Path<T>}
        label="Tags list"
        selectPlaceholder="Select datalist"
        searchPlaceholder="Search datalist..."
        noItemsText="No datalist found"
        {...dlAdapter}
      />

      <CheckboxFormField
        control={control}
        name={"autoCreatePermissions" as Path<T>}
        label="Auto create permissions"
        onClick={() => setIsAutoCreatePermission((prev) => !prev)}
      />

      {isFalsy(isAutoCreatePermission) && (
        <fieldset className="px-1.5 py-2.5 rounded-md border border-dashed">
          <legend className="text-sm font-medium italic">Permissions</legend>
          <ComboboxFormField
            control={control}
            name={"createPermissionId" as Path<T>}
            label="Create"
            selectPlaceholder="Select create permission"
            searchPlaceholder="Search create permission..."
            noItemsText="No create permission found"
            {...pAdapter}
          />

          <ComboboxFormField
            control={control}
            name={"viewPermissionId" as Path<T>}
            label="View"
            selectPlaceholder="Select view permission"
            searchPlaceholder="Search view permission..."
            noItemsText="No view permission found"
            {...pAdapter}
          />

          <ComboboxFormField
            control={control}
            name={"editPermissionId" as Path<T>}
            label="Edit"
            selectPlaceholder="Select edit permission"
            searchPlaceholder="Search edit permission..."
            noItemsText="No edit permission found"
            {...pAdapter}
          />

          <ComboboxFormField
            control={control}
            name={"deletePermissionId" as Path<T>}
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
        name={"space" as Path<T>}
        onClick={() => setIsSpaceChecked((prev) => !prev)}
      />

      {isSpaceChecked && (
        <fieldset className="px-1.5 py-2.5 rounded-md border border-dashed flex flex-col gap-4">
          <legend className="text-sm font-medium italic">Spaces</legend>
          <CheckboxFormField
            control={control}
            name={"permissionSchemaSpace" as Path<T>}
            label="Permission schema space"
          />

          <CheckboxFormField
            control={control}
            name={"twinflowSchemaSpace" as Path<T>}
            label="Twinflow schema space"
          />

          <CheckboxFormField
            control={control}
            name={"twinClassSchemaSpace" as Path<T>}
            label="Twin class schema space"
          />

          <CheckboxFormField
            control={control}
            name={"aliasSpace" as Path<T>}
            label="Alias space"
          />
        </fieldset>
      )}
    </>
  );
}
