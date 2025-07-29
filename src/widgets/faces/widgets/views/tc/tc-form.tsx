// @ts-nocheck
// TODO: remove ts-nocheck by importing validy src/shared/api/generated/schema.d.ts
import { JSX } from "react";
import { Control, Path } from "react-hook-form";

import {
  ComboboxFormField,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { FaceTC001ViewRs as FaceTC } from "@/entities/face";
import { TwinFormValues, TwinSelfFieldId } from "@/entities/twin";
import { TwinClassField } from "@/entities/twin-class-field";
import { RelatedObjects } from "@/shared/api";

import { TwinFieldFormField } from "../../../../form-fields";
import { useTwinClassFields } from "../../../../tables/twins/use-twin-form-fields";

type Field = {
  key: string;
  label: string;
  twinClassFieldId: string;
  twinClassField?: TwinClassField;
};

type TwinSelfFieldComponentProps = {
  control: Control<TwinFormValues>;
  name: Path<TwinFormValues>;
  label: string;
};

export function hydrateFaceTwinCreateFields(
  fields: Field[],
  relatedObjects?: RelatedObjects
) {
  if (!relatedObjects?.twinClassFieldMap) return fields;

  return fields.map((field) => {
    const twinClassField =
      relatedObjects.twinClassFieldMap?.[field.twinClassFieldId];
    return {
      ...field,
      twinClassField,
    };
  });
}

export function TCForm({
  control,
  modalCreateData,
}: {
  control: Control<TwinFormValues>;
  modalCreateData: FaceTC;
}) {
  const { hasHeadClass, twinClassAdapter, userAdapter, headAdapter } =
    useTwinClassFields(control, modalCreateData.faceTwinCreate?.twinClassId);

  const selfFields: Partial<
    Record<TwinSelfFieldId, (props: TwinSelfFieldComponentProps) => JSX.Element>
  > = {
    "00000000-0000-0000-0011-000000000007": ({ control, name, label }) => (
      <ComboboxFormField
        control={control}
        name={name}
        label={label}
        {...userAdapter}
        required
      />
    ),
    "00000000-0000-0000-0011-000000000004": ({ control, name, label }) => (
      <TextAreaFormField control={control} name={name} label={label} required />
    ),
    "00000000-0000-0000-0011-000000000003": ({ control, name, label }) => (
      <TextFormField control={control} name={name} label={label} required />
    ),
  };

  const { faceTwinCreate, relatedObjects } = modalCreateData;

  const hydratedFields = hydrateFaceTwinCreateFields(
    (faceTwinCreate?.fields as Field[]) ?? [],
    relatedObjects
  );

  const classFieldId = "00000000-0000-0000-0011-000000000013";
  const headFieldId = "00000000-0000-0000-0011-000000000009";
  const classField = hydratedFields.find(
    (f) => f.twinClassFieldId === classFieldId
  );
  const headField = hydratedFields.find(
    (f) => f.twinClassFieldId === headFieldId
  );

  return (
    <div className="space-y-8">
      {classField && (
        <ComboboxFormField
          control={control}
          name="classId"
          label={classField.label}
          noItemsText="No data found"
          {...twinClassAdapter}
          required
        />
      )}

      {headField && hasHeadClass && (
        <ComboboxFormField
          name="headTwinId"
          control={control}
          label={headField.label}
          {...headAdapter}
          required
        />
      )}

      {hydratedFields.map((field) => {
        if (
          field.twinClassFieldId === classFieldId ||
          field.twinClassFieldId === headFieldId
        ) {
          return null;
        }

        const StaticFieldComponent =
          selfFields[field.twinClassFieldId as TwinSelfFieldId];
        if (!StaticFieldComponent) return null;

        const nameMap: Record<string, Path<TwinFormValues>> = {
          "00000000-0000-0000-0011-000000000003": "name",
          "00000000-0000-0000-0011-000000000007": "assignerUserId",
          "00000000-0000-0000-0011-000000000004": "description",
        };

        return (
          <StaticFieldComponent
            key={field.key}
            control={control}
            name={nameMap[field.twinClassFieldId] ?? `fields.${field.key}`}
            label={field.label}
          />
        );
      })}

      {hydratedFields.map((field) => {
        const isStaticField =
          selfFields[field.twinClassFieldId as TwinSelfFieldId] ||
          field.twinClassFieldId === classFieldId ||
          field.twinClassFieldId === headFieldId;

        if (isStaticField) return null;

        return (
          <TwinFieldFormField
            key={field.key}
            name={`fields.${field.key}`}
            control={control}
            label={field.label}
            descriptor={field.twinClassField?.descriptor}
            twinClassId={modalCreateData.faceTwinCreate?.twinClassId!}
            required={field.twinClassField?.required}
          />
        );
      })}
    </div>
  );
}
