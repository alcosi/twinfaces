import {
  Control,
  FieldValues,
  Path,
  PathValue,
  useWatch,
} from "react-hook-form";
import {
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields/text-form-field";
import { CheckboxFormField } from "@/components/form-fields/checkbox-form-field";
import { TwinClassSelectField } from "@/features/twinClass";
import { FeaturerFormField } from "@/components/form-fields/featurer-form-field";
import { FeaturerTypes } from "@/components/featurer-input";

export function TwinClassFormFields<T extends FieldValues>({
  control,
}: {
  control: Control<T>;
}) {
  const headTwinClassId = useWatch({
    control: control,
    name: "headTwinClassId" as Path<T>,
    defaultValue: "" as PathValue<T, Path<T>>,
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
        name={"headTwinClassId" as Path<T>}
        label="Head"
      />
      {headTwinClassId && (
        <>
          <FeaturerFormField
            control={control}
            name={"headHunterFeaturerId" as Path<T>}
            paramsName={"headHunterParams" as Path<T>}
            typeId={FeaturerTypes.headHunter}
            label={"Head Hunter"}
          />
          {/*<FeaturerInput typeId={FeaturerTypes.headHunter} onChange={(val) => {*/}
          {/*    console.log('new featurer', val)*/}
          {/*    setFeaturer(val)*/}
          {/*}}/>*/}
        </>
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
      <TextFormField
        control={control}
        name={"markerDataListId" as Path<T>}
        label="Marker data list ID"
      />
      <TextFormField
        control={control}
        name={"tagDataListId" as Path<T>}
        label="Tag data list ID"
      />
      <TextFormField
        control={control}
        name={"viewPermissionId" as Path<T>}
        label="View permission ID"
      />
    </>
  );
}
