import { useEffect, useMemo, useState } from "react";
import { Control, Path, useFormContext } from "react-hook-form";

import {
  ComboboxFormField,
  ComboboxFormItem,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { FaceTC001ViewRs as FaceTC } from "@/entities/face";
import { TwinFormValues, TwinSelfFieldId } from "@/entities/twin";
import { TwinClass_DETAILED } from "@/entities/twin-class";
import {
  TwinClassField,
  useSearchTwinClassFieldsBySearchId,
} from "@/entities/twin-class-field";
import { FormFieldSkeleton } from "@/features/ui/skeletons";
import { RelatedObjects } from "@/shared/api";
import { isArray, isPopulatedArray, isTruthy } from "@/shared/libs";

import { TwinFieldFormField } from "../../../../form-fields";
import { useTwinClassFields } from "../../../../tables/twins/use-twin-form-fields";

type Field = {
  key: string;
  label: string;
  twinClassFieldId: string;
  twinClassField?: TwinClassField;
};

// type TwinSelfFieldComponentProps = {
//   control: Control<TwinFormValues>;
//   name: Path<TwinFormValues>;
//   label: string;
// };

// export function hydrateFaceTwinCreateFields(
//   fields: Field[],
//   relatedObjects?: RelatedObjects
// ) {
//   if (!relatedObjects?.twinClassFieldMap) return fields;

//   return fields.map((field) => {
//     const twinClassField =
//       relatedObjects.twinClassFieldMap?.[field.twinClassFieldId];
//     return {
//       ...field,
//       twinClassField,
//     };
//   });
// }

export function TCForm({
  control,
  modalCreateData,
}: {
  control: Control<TwinFormValues>;
  modalCreateData: FaceTC;
}) {
  console.log("modalCreateData", modalCreateData);
  const { faceTwinCreate } = modalCreateData;
  const { setValue, watch } = useFormContext<TwinFormValues>();
  const { searchTwinClassFieldsBySearchId, loading } =
    useSearchTwinClassFieldsBySearchId();
  const selectedClass = watch("classId");
  const [fetchedFields, setFetchedFields] = useState<TwinClassField[]>([]);

  const variantOptions = faceTwinCreate?.options || [];
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(
    () =>
      faceTwinCreate?.singleOptionSilentMode && variantOptions.length === 0
        ? variantOptions[0]?.id
        : undefined
  );

  const selectedOption = useMemo(
    () => variantOptions.find((opt) => opt.id === selectedOptionId),
    [variantOptions, selectedOptionId]
  );

  useEffect(() => {
    const fetchTwinClassFields = async () => {
      if (selectedOption?.twinClassFieldSearchId && selectedClass) {
        try {
          const result = await searchTwinClassFieldsBySearchId({
            searchId: selectedOption.twinClassFieldSearchId,
            twinClassId: selectedClass,
          });

          console.log("Fetched TwinClassFields:", result);
          setFetchedFields(result?.data ?? []);
        } catch (error) {
          console.error("Error fetching twin class fields", error);
          setFetchedFields([]);
        }
      } else {
        setFetchedFields([]);
      }
    };

    fetchTwinClassFields();
  }, [
    selectedOption?.twinClassFieldSearchId,
    selectedClass,
    searchTwinClassFieldsBySearchId,
  ]);

  const { hasHeadClass, twinClassBySearchIdAdapter, userAdapter, headAdapter } =
    useTwinClassFields(control, selectedOption?.twinClassSearchId);

  // const selfFields: Partial<
  //   Record<TwinSelfFieldId, (props: TwinSelfFieldComponentProps) => JSX.Element>
  // > = {
  //   "00000000-0000-0000-0011-000000000007": ({ control, name, label }) => (
  //     <ComboboxFormField
  //       control={control}
  //       name={name}
  //       label={label}
  //       {...userAdapter}
  //       required
  //     />
  //   ),
  //   "00000000-0000-0000-0011-000000000004": ({ control, name, label }) => (
  //     <TextAreaFormField control={control} name={name} label={label} required />
  //   ),
  //   "00000000-0000-0000-0011-000000000003": ({ control, name, label }) => (
  //     <TextFormField control={control} name={name} label={label} required />
  //   ),
  //   "00000000-0000-0000-0011-000000000005": ({ control, name, label }) => (
  //     <TextFormField control={control} name={name} label={label} required />
  //   ),
  // };

  // const hydratedFields = hydrateFaceTwinCreateFields(
  //   (faceTwinCreate?.fields as Field[]) ?? [],
  //   relatedObjects
  // );

  // const classFieldId = "00000000-0000-0000-0011-000000000013";
  // const headFieldId = "00000000-0000-0000-0011-000000000009";
  // const classField = hydratedFields.find(
  //   (f) => f.twinClassFieldId === classFieldId
  // );
  // const headField = hydratedFields.find(
  //   (f) => f.twinClassFieldId === headFieldId
  // );

  console.log(selectedClass);
  return (
    <div className="space-y-8">
      {(!faceTwinCreate?.singleOptionSilentMode ||
        variantOptions.length > 1) && (
        <ComboboxFormItem
          label={faceTwinCreate?.optionSelectLabel ?? "Select variant"}
          onSelect={(options) => {
            setSelectedOptionId(options?.[0]?.id);
            setValue("classId", "");
          }}
          getItems={() =>
            Promise.resolve(
              variantOptions.map((opt) => ({
                id: opt.id,
                label: opt.optionLabel || "N/A",
              }))
            )
          }
          getById={async (id) => {
            const found = variantOptions.find((opt) => opt.id === id);
            return found
              ? { id: found.id, label: found.optionLabel || "N/A" }
              : undefined;
          }}
          renderItem={(item) => item.label}
          required
        />
      )}

      {selectedOption?.twinClassSearchId && (
        <ComboboxFormField
          control={control}
          name="classId"
          label={selectedOption.classSelectorLabel || "Select class"}
          noItemsText="No data found"
          {...twinClassBySearchIdAdapter}
          required
        />
      )}

      {/* {headField && hasHeadClass && (
        <ComboboxFormField
          name="headTwinId"
          control={control}
          label={headField.label}
          {...headAdapter}
          required
        />
      )} */}

      {/* {hydratedFields.map((field) => {
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
          "00000000-0000-0000-0011-000000000005": "externalId",
        };

        return (
          <StaticFieldComponent
            key={field.key}
            control={control}
            name={nameMap[field.twinClassFieldId] ?? `fields.${field.key}`}
            label={field.label}
          />
        );
      })} */}

      {/* {hydratedFields.map((field) => {
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
            twinClassId={
              modalCreateData.faceTwinCreate?.options[0]?.twinClassSearchId!
            }
            required={field.twinClassField?.required}
          />
        );
      })} */}
      {isTruthy(loading)
        ? fetchedFields.map((_, index) => {
            return <FormFieldSkeleton key={index} />;
          })
        : fetchedFields.map((field) => (
            <TwinFieldFormField
              key={field.key}
              name={`fields.${field.key}`}
              control={control}
              label={field.name}
              descriptor={field.descriptor}
              twinClassId={
                Array.isArray(selectedClass) ? selectedClass[0]?.id : undefined
              }
              required={field.required}
            />
          ))}
    </div>
  );
}
