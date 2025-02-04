import { CheckboxFormField, CheckboxFormItem } from "@/components/form-fields";
import { TextAreaFormField, TextFormField } from "@/components/form-fields";
import { FeaturerTypes } from "@/entities/featurer";
import { TwinClassFieldValues } from "@/entities/twinClass";
import { TwinClassSelectField } from "@/features/twinClass";
import { isPopulatedArray } from "@/shared/libs";
import { FeaturerFormField } from "@/widgets/form-fields";
import { Control, Path, PathValue, useWatch } from "react-hook-form";
import { ComboboxFormField } from "@/components/form-fields/combobox";
import { useDatalistSelectAdapter } from "@/entities/datalist";
import { usePermissionSelectAdapter } from "@/entities/permission";
import { useState } from "react";
import { useTwinClassOwnerTypeSelectAdapter } from "@/entities/domain";
import { Checkbox } from "../../shared/ui";

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

      <TwinClassSelectField
        control={control}
        name={"headTwinClass" as Path<T>}
        label="Head"
      />

      {isPopulatedArray(headTwinClass) && (
        <FeaturerFormField
          typeId={FeaturerTypes.headHunter}
          control={control}
          name={"headHunterFeaturer" as Path<T>}
          label={"Head Hunter"}
        />
      )}

      <TwinClassSelectField
        control={control}
        name={"extendsTwinClassId" as Path<T>}
        label="Extends"
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

      <CheckboxFormItem
        inForm
        name={"autoCreatePermissions"}
        label="Auto create permissions"
        fieldValue={isAutoCreatePermission}
        onClick={() => setIsAutoCreatePermission((prev) => !prev)}
      />

      {!isAutoCreatePermission && (
        <fieldset className="px-1.5 py-2.5 rounded-md border border-dashed">
          <legend className="text-sm font-medium italic">Permissions</legend>
          <ComboboxFormField
            control={control}
            name={"createPermission" as Path<T>}
            label="Create"
            selectPlaceholder="Select create permission"
            searchPlaceholder="Search create permission..."
            noItemsText="No create permission found"
            {...pAdapter}
          />

          <ComboboxFormField
            control={control}
            name={"viewPermission" as Path<T>}
            label="View"
            selectPlaceholder="Select view permission"
            searchPlaceholder="Search view permission..."
            noItemsText="No view permission found"
            {...pAdapter}
          />

          <ComboboxFormField
            control={control}
            name={"editPermission" as Path<T>}
            label="Edit"
            selectPlaceholder="Select edit permission"
            searchPlaceholder="Search edit permission..."
            noItemsText="No edit permission found"
            {...pAdapter}
          />

          <ComboboxFormField
            control={control}
            name={"deletePermission" as Path<T>}
            label=" Delete"
            selectPlaceholder="Select delete permission"
            searchPlaceholder="Search delete permission..."
            noItemsText="No delete permission found"
            {...pAdapter}
          />
        </fieldset>
      )}

      <CheckboxFormItem
        label="Space"
        name={"space" as Path<T>}
        onClick={() => setIsSpaceChecked((prev) => !prev)}
      />

      {isSpaceChecked && (
        <div className="px-1.5 py-2.5 rounded-md border border-dashed flex flex-col gap-4">
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
        </div>
      )}
    </>
  );
}
