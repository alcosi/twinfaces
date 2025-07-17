"use client";

import { useState } from "react";
import { Control, Path } from "react-hook-form";

import {
  ComboboxFormField,
  ComboboxFormItem,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { TwinFormValues, TwinSelfFieldId } from "@/entities/twin";
import { RelatedObjects } from "@/shared/api";

import { TwinFieldFormField } from "../../../../form-fields";
import { useTwinClassFields } from "../../../../tables/twins/use-twin-form-fields";
import { normalizeTwinCreateData } from "./normalize-twin-create-data";
import { TCFormField, TCViewMap } from "./types";

type TwinSelfFieldProps = {
  control: Control<TwinFormValues>;
  name: Path<TwinFormValues>;
  label: string;
};

type TCFormProps<K extends keyof TCViewMap> = {
  control: Control<TwinFormValues>;
  modalCreateData: TCViewMap[K];
};

function hydrateFaceTwinCreateFields(
  fields: TCFormField[],
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

export function TCForm<K extends keyof TCViewMap>({
  control,
  modalCreateData,
}: TCFormProps<K>) {
  const { faceTwinCreate, relatedObjects } = modalCreateData;
  const [selectedOptionId, setSelectedOptionId] = useState<string>();

  const { twinClassId, fields, showVariantSelector, variantOptions } =
    normalizeTwinCreateData(faceTwinCreate!, selectedOptionId);

  const hydratedFields = hydrateFaceTwinCreateFields(
    (fields as TCFormField[]) ?? [],
    relatedObjects
  );

  const { hasHeadClass, twinClassAdapter, userAdapter, headAdapter } =
    useTwinClassFields(control, twinClassId);

  const selfFields: Partial<
    Record<TwinSelfFieldId, (props: TwinSelfFieldProps) => JSX.Element>
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
      {showVariantSelector && variantOptions && (
        <ComboboxFormItem
          label="Select variant"
          onSelect={(options) => setSelectedOptionId(options?.[0]?.id)}
          getItems={() =>
            Promise.resolve(
              variantOptions.map((opt) => ({ id: opt.id, label: opt.label }))
            )
          }
          getById={async (id) => {
            const found = variantOptions.find((opt) => opt.id === id);
            return found ? { id: found.id, label: found.label } : undefined;
          }}
          renderItem={(item) => item.label}
          required
        />
      )}

      {twinClassId && (
        <>
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
                twinClassId={twinClassId!}
                required={field.twinClassField?.required}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
