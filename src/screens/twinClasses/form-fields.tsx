import { CheckboxFormField } from "@/components/form-fields/checkbox-form-field";
import {
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields/text-form-field";
import { FeaturerTypes } from "@/entities/featurer";
import { TwinClassFieldValues } from "@/entities/twinClass";
import { TwinClassSelectField } from "@/features/twinClass";
import { isPopulatedArray } from "@/shared/libs";
import { FeaturerFormField } from "@/widgets/form-fields";
import { Control, Path, PathValue, useWatch } from "react-hook-form";
import { DatalistSelectField } from "@/features/datalist";
import { PermissionSelectField } from "@/features/permission";

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

      <DatalistSelectField
        control={control}
        name={"markerDataListId" as Path<T>}
        label="Markers List"
      />

      <DatalistSelectField
        control={control}
        name={"tagDataListId" as Path<T>}
        label="Tags list"
      />

      <PermissionSelectField
        control={control}
        name={"viewPermissionId" as Path<T>}
        label="Permission"
      />
    </>
  );
}
