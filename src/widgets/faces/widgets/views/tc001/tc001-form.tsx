import { JSX, useEffect, useMemo, useState } from "react";
import { Control, Path, useFormContext } from "react-hook-form";

import {
  ComboboxFormField,
  ComboboxFormItem,
  TextAreaFormField,
  TextFormField,
} from "@/components/form-fields";

import { FaceTC001ViewRs } from "@/entities/face";
import {
  TwinFormValues,
  TwinSelfFieldId,
  useTwinClassFields,
} from "@/entities/twin";
import {
  TwinClassField,
  useTwinClassFieldSearch,
} from "@/entities/twin-class-field";
import {
  isEmptyArray,
  isPopulatedArray,
  reduceToObject,
  toArray,
} from "@/shared/libs";

import { TwinFieldFormField } from "../../../../form-fields";

type TwinSelfFieldComponentProps = {
  control: Control<TwinFormValues>;
  name: Path<TwinFormValues>;
  label: string;
  required?: boolean;
};

export function TC001Form({
  control,
  modalCreateData,
}: {
  control: Control<TwinFormValues>;
  modalCreateData: FaceTC001ViewRs;
}) {
  const { faceTwinCreate } = modalCreateData;
  const { setValue, watch } = useFormContext<TwinFormValues>();
  const { searchBySearchId } = useTwinClassFieldSearch();
  const selectedClass = watch("classId");
  const [fetchedFields, setFetchedFields] = useState<TwinClassField[]>([]);

  const variantOptions = faceTwinCreate?.options || [];
  const [selectedOptionId, setSelectedOptionId] = useState<string | undefined>(
    () => {
      if (
        faceTwinCreate?.singleOptionSilentMode &&
        !isEmptyArray(variantOptions)
      ) {
        return variantOptions[0]?.id;
      }
      return undefined;
    }
  );

  const selectedOption = useMemo(
    () => variantOptions.find((opt) => opt.id === selectedOptionId),
    [variantOptions, selectedOptionId]
  );

  useEffect(() => {
    if (selectedOption?.pointedHeadTwinId) {
      setValue("headTwinId", selectedOption.pointedHeadTwinId);
    }
  }, [selectedOption?.pointedHeadTwinId, setValue]);

  useEffect(() => {
    if (
      faceTwinCreate?.singleOptionSilentMode &&
      !isEmptyArray(variantOptions)
    ) {
      const firstOption = variantOptions[0];
      setSelectedOptionId(firstOption?.id);
      setValue("classId", "");
    }
  }, [faceTwinCreate?.singleOptionSilentMode, variantOptions, setValue]);

  useEffect(() => {
    const fetchTwinClassFields = async () => {
      if (selectedOption?.twinClassFieldSearchId && selectedClass) {
        try {
          const result = await searchBySearchId({
            searchId: selectedOption.twinClassFieldSearchId,
            narrow: {
              twinClassIdMap: reduceToObject({
                list: toArray(selectedClass),
                defaultValue: true,
              }),
            },
            params: selectedOption.twinClassFieldsSearchParams!,
          });

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
  }, [selectedOption?.twinClassFieldSearchId, selectedClass, searchBySearchId]);

  const { twinClassBySearchIdAdapter, userAdapter } = useTwinClassFields(
    control,
    {
      baseTwinClassId: selectedOption?.twinClassSearchId,
      twinClassSearchParams: selectedOption?.twinClassSearchParams,
    }
  );

  const selfFields: Partial<
    Record<TwinSelfFieldId, (props: TwinSelfFieldComponentProps) => JSX.Element>
  > = {
    "00000000-0000-0000-0011-000000000007": ({
      control,
      name,
      label,
      required,
    }) => (
      <ComboboxFormField
        control={control}
        name={name}
        label={label}
        {...userAdapter}
        required={required}
      />
    ),
    "00000000-0000-0000-0011-000000000004": ({
      control,
      name,
      label,
      required,
    }) => (
      <TextAreaFormField
        control={control}
        name={name}
        label={label}
        required={required}
      />
    ),
    "00000000-0000-0000-0011-000000000003": ({
      control,
      name,
      label,
      required,
    }) => (
      <TextFormField
        control={control}
        name={name}
        label={label}
        required={required}
      />
    ),
    "00000000-0000-0000-0011-000000000005": ({
      control,
      name,
      label,
      required,
    }) => (
      <TextFormField
        control={control}
        name={name}
        label={label}
        required={required}
      />
    ),
  };

  const nameMap: Record<string, Path<TwinFormValues>> = {
    "00000000-0000-0000-0011-000000000003": "name",
    "00000000-0000-0000-0011-000000000007": "assignerUserId",
    "00000000-0000-0000-0011-000000000004": "description",
    "00000000-0000-0000-0011-000000000005": "externalId",
  };

  return (
    <div className="space-y-8">
      {!faceTwinCreate?.singleOptionSilentMode &&
        !isEmptyArray(variantOptions) && (
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
                  label: opt.label || "N/A",
                }))
              )
            }
            getById={async (id) => {
              const found = variantOptions.find((opt) => opt.id === id);
              return found
                ? { id: found.id, label: found.label || "N/A" }
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

      {fetchedFields?.reduce<JSX.Element[]>((acc, field) => {
        if (!field.id) return acc;

        const SelfComponent = selfFields[field.id as keyof typeof selfFields];

        if (SelfComponent) {
          acc.push(
            <SelfComponent
              key={field.key}
              control={control}
              name={nameMap[field.id]!}
              label={field.name!}
              required={field.required}
            />
          );
        } else {
          acc.push(
            <TwinFieldFormField
              key={field.key}
              name={`fields.${field.key}`}
              control={control}
              label={field.name}
              descriptor={field.descriptor}
              twinClassId={
                isPopulatedArray<{ id: string }>(selectedClass)
                  ? selectedClass[0]?.id
                  : ""
              }
              required={field.required}
            />
          );
        }

        return acc;
      }, [])}
    </div>
  );
}
